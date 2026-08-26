#Requires -Version 7.2

<#
.SYNOPSIS
Publica una release estática verificada del portafolio o activa una release previa.

.EXAMPLE
.\deploy-vps.ps1 -DryRun

.EXAMPLE
.\deploy-vps.ps1

.EXAMPLE
.\deploy-vps.ps1 -RollbackTo 20260820T030845Z-e59a01b
#>

[CmdletBinding(DefaultParameterSetName = "Deploy")]
param(
    [Parameter(ParameterSetName = "Rollback", Mandatory)]
    [ValidatePattern("^\d{8}T\d{6}Z-[0-9a-f]{7,40}$")]
    [string]$RollbackTo,

    [ValidatePattern("^(?=.{1,253}$)[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$")]
    [string]$HostName = "72.60.61.126",

    [ValidateSet("deploy")]
    [string]$RemoteUser = "deploy",

    [ValidateRange(1, 65535)]
    [int]$Port = 22,

    [string]$KeyPath = (Join-Path $env:USERPROFILE ".ssh\id_ed25519"),

    [Parameter(ParameterSetName = "Deploy")]
    [switch]$SkipInstall,

    [Parameter(ParameterSetName = "Deploy")]
    [switch]$SkipAudit,

    [Parameter(ParameterSetName = "Deploy")]
    [switch]$ValidateOnly,

    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$publicOrigin = "https://nightstrike.cloud"
$requiredRelativeFiles = @(
    "index.html",
    "proyectos/machine-failure-risk-classifier/index.html",
    "site-version.json",
    "CV_Cristobal_Vergara.pdf",
    "cristobal-vergara.webp",
    "favicon.png",
    "og.png",
    "robots.txt",
    "sitemap.xml"
)

function Show-DryRunPlan {
    if ($PSCmdlet.ParameterSetName -eq "Rollback") {
        Write-Host "Dry run: no se ejecutará ningún comando local, SSH ni HTTP."
        Write-Host "1. Verificar que exista releases/$RollbackTo y que contenga los archivos públicos obligatorios."
        Write-Host "2. Leer y validar el destino actual de current."
        Write-Host "3. Cambiar current atómicamente a releases/$RollbackTo."
        Write-Host "4. Comprobar el sitio desde el VPS y desde $publicOrigin."
        Write-Host "5. Restaurar el enlace anterior automáticamente si falla la comprobación."
        return
    }

    Write-Host "Dry run: no se ejecutará ningún comando local, SSH ni HTTP."
    Write-Host "1. Verificar main, worktree limpio y sincronización exacta con origin/main."
    Write-Host "2. Reproducir CI: instalar, probar, comprobar tipos, lint y auditoría."
    Write-Host "3. Validar deploy/, site-version.json y la ausencia de enlaces simbólicos."
    Write-Host "4. Empaquetar y calcular SHA-256 para <UTC>-<7-char-commit>."
    Write-Host "5. Subir a /home/deploy y extraer en releases/<UTC>-<7-char-commit>."
    Write-Host "6. Validar la release y cambiar current atómicamente."
    Write-Host "7. Comprobar $publicOrigin y restaurar el enlace anterior si algo falla."
}

function Resolve-NativeCommand {
    param([Parameter(Mandatory)][string]$Name)

    $command = Get-Command $Name -CommandType Application -ErrorAction Stop |
        Select-Object -First 1
    return $command.Source
}

function Invoke-Native {
    param(
        [Parameter(Mandatory)][string]$FilePath,
        [Parameter(Mandatory)][string[]]$Arguments
    )

    & $FilePath @Arguments
    $exitCode = $LASTEXITCODE
    if ($exitCode -ne 0) {
        throw "$FilePath terminó con código $exitCode."
    }
}

function Invoke-NativeCapture {
    param(
        [Parameter(Mandatory)][string]$FilePath,
        [Parameter(Mandatory)][string[]]$Arguments
    )

    $output = @(& $FilePath @Arguments 2>&1)
    $exitCode = $LASTEXITCODE
    if ($exitCode -ne 0) {
        $details = $output -join [Environment]::NewLine
        throw "$FilePath terminó con código $exitCode.$([Environment]::NewLine)$details"
    }
    return $output
}

function Invoke-RemoteScript {
    param([Parameter(Mandatory)][string]$BashScript)

    $normalized = $BashScript.Replace("`r`n", "`n")
    $encoded = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($normalized))
    $remoteCommand = "printf '%s' '$encoded' | base64 --decode | bash"
    $arguments = @($script:sshArguments + @($script:sshTarget, $remoteCommand))
    return Invoke-NativeCapture -FilePath $script:sshExecutable -Arguments $arguments
}

function Test-PublicSite {
    param([string]$ExpectedCommit)

    $cacheToken = if ($ExpectedCommit) { $ExpectedCommit } else { [DateTimeOffset]::UtcNow.ToUnixTimeSeconds() }
    $paths = @(
        "/",
        "/proyectos/machine-failure-risk-classifier/",
        "/CV_Cristobal_Vergara.pdf"
    )

    foreach ($path in $paths) {
        $separator = if ($path.Contains("?")) { "&" } else { "?" }
        $uri = "$publicOrigin$path$separator`v=$cacheToken"
        $response = Invoke-WebRequest -Uri $uri -Method Get -MaximumRedirection 5 -TimeoutSec 20
        if ($response.StatusCode -ne 200) {
            throw "La comprobación pública devolvió HTTP $($response.StatusCode) para $path."
        }
    }

    $versionUri = "$publicOrigin/site-version.json?v=$cacheToken"
    $version = Invoke-RestMethod -Uri $versionUri -Method Get -TimeoutSec 20
    if ($ExpectedCommit -and $version.commit -ne $ExpectedCommit) {
        throw "La versión pública no corresponde al commit esperado."
    }
}

function Restore-RemoteRelease {
    param(
        [Parameter(Mandatory)]
        [ValidatePattern("^\d{8}T\d{6}Z-[0-9a-f]{7,40}$")]
        [string]$ReleaseId,

        [Parameter(Mandatory)]
        [ValidatePattern("^\d{8}T\d{6}Z-[0-9a-f]{7,40}$")]
        [string]$ExpectedCurrentId
    )

    $restoreScript = @'
set -Eeuo pipefail
umask 022

root='/var/www/portfolio'
releases="$root/releases"
release_id='__RELEASE_ID__'
target="$releases/$release_id"
expected_current="$releases/__EXPECTED_CURRENT_ID__"

test "$(id -un)" = 'deploy'
test "$(realpath -e -- "$root")" = "$root"
test "$(realpath -e -- "$releases")" = "$releases"
test -w "$root"
test -d "$target"
test -f "$target/index.html"
test -f "$target/site-version.json"

exec 9>"$root/.deploy.lock"
flock -n 9 || { printf 'Otro despliegue está en curso.\n' >&2; exit 75; }

current="$(readlink -f -- "$root/current")"
case "$current" in
    "$releases"/*) ;;
    *) printf 'El enlace current apunta fuera de releases.\n' >&2; exit 76 ;;
esac

if test "$current" != "$expected_current"; then
    printf 'current cambió durante la comprobación; no se modificó.\n' >&2
    exit 79
fi

if test "$current" = "$target"; then
    printf 'CURRENT=%s\n' "$target"
    exit 0
fi

next="$root/.restore-$release_id-$$"
cleanup() {
    code=$?
    trap - EXIT HUP INT TERM
    rm -f -- "$next"
    exit "$code"
}
trap cleanup EXIT
trap 'exit 129' HUP
trap 'exit 130' INT
trap 'exit 143' TERM
ln -s "$target" "$next"
mv -Tf -- "$next" "$root/current"
rm -f -- "$next"
trap - EXIT HUP INT TERM
printf 'CURRENT=%s\n' "$target"
'@.Replace("__RELEASE_ID__", $ReleaseId).
        Replace("__EXPECTED_CURRENT_ID__", $ExpectedCurrentId)

    return Invoke-RemoteScript -BashScript $restoreScript
}

function Invoke-Rollback {
    param([Parameter(Mandatory)][string]$ReleaseId)

    $rollbackScript = @'
set -Eeuo pipefail
umask 022

root='/var/www/portfolio'
releases="$root/releases"
release_id='__RELEASE_ID__'
target="$releases/$release_id"

test "$(id -un)" = 'deploy'
test "$(realpath -e -- "$root")" = "$root"
test "$(realpath -e -- "$releases")" = "$releases"
test -w "$root"
test -d "$target"
test -f "$target/index.html"
test -f "$target/proyectos/machine-failure-risk-classifier/index.html"
test -f "$target/site-version.json"
test -f "$target/CV_Cristobal_Vergara.pdf"
test -f "$target/cristobal-vergara.webp"
test -f "$target/favicon.png"
test -f "$target/og.png"
test -f "$target/robots.txt"
test -f "$target/sitemap.xml"

commit_prefix="${release_id##*-}"
target_commit="$(sed -n 's/.*"commit":"\([0-9a-fA-F]\{40\}\)".*/\1/p' "$target/site-version.json" | tr 'A-F' 'a-f')"
printf '%s' "$target_commit" | grep -Eq '^[0-9a-f]{40}$'
case "$target_commit" in
    "$commit_prefix"*) ;;
    *) printf 'La release no coincide con el commit indicado por su nombre.\n' >&2; exit 78 ;;
esac

exec 9>"$root/.deploy.lock"
flock -n 9 || { printf 'Otro despliegue está en curso.\n' >&2; exit 75; }

previous="$(readlink -f -- "$root/current")"
case "$previous" in
    "$releases"/*) ;;
    *) printf 'El enlace current apunta fuera de releases.\n' >&2; exit 76 ;;
esac

if test "$previous" = "$target"; then
    printf 'PREVIOUS=%s\nCURRENT=%s\nTARGET_COMMIT=%s\nCHANGED=0\n' "$previous" "$target" "$target_commit"
    exit 0
fi

next="$root/.rollback-$release_id-$$"
restore="$root/.restore-$release_id-$$"
switched=0

cleanup() {
    code=$?
    trap - EXIT HUP INT TERM
    rm -f -- "$next" "$restore"
    if test "$code" -ne 0 && test "$switched" -eq 1; then
        ln -s "$previous" "$restore"
        mv -Tf -- "$restore" "$root/current"
    fi
    exit "$code"
}
trap cleanup EXIT
trap 'exit 129' HUP
trap 'exit 130' INT
trap 'exit 143' TERM

ln -s "$target" "$next"
mv -Tf -- "$next" "$root/current"
switched=1

curl_common=(
    --fail --silent --show-error --location
    --retry 2 --retry-delay 1 --connect-timeout 5 --max-time 20
    --resolve nightstrike.cloud:443:127.0.0.1
)
curl "${curl_common[@]}" --output /dev/null https://nightstrike.cloud/
curl "${curl_common[@]}" --output /dev/null \
    https://nightstrike.cloud/proyectos/machine-failure-risk-classifier/
curl "${curl_common[@]}" --output /dev/null \
    https://nightstrike.cloud/CV_Cristobal_Vergara.pdf
version_payload="$(curl "${curl_common[@]}" https://nightstrike.cloud/site-version.json)"
printf '%s' "$version_payload" | grep -Fq "\"commit\":\"$target_commit\""

rm -f -- "$next" "$restore"
trap - EXIT HUP INT TERM
printf 'PREVIOUS=%s\nCURRENT=%s\nTARGET_COMMIT=%s\nCHANGED=1\n' \
    "$previous" "$target" "$target_commit"
'@.Replace("__RELEASE_ID__", $ReleaseId)

    $previousPath = $null
    $targetCommit = $null
    $changed = $false
    $output = Invoke-RemoteScript -BashScript $rollbackScript
    $output | ForEach-Object {
        Write-Host $_
        if ($_ -match "^PREVIOUS=(.+)$") {
            $previousPath = $Matches[1]
        }
        elseif ($_ -match "^TARGET_COMMIT=([0-9a-f]{40})$") {
            $targetCommit = $Matches[1]
        }
        elseif ($_ -eq "CHANGED=1") {
            $changed = $true
        }
    }

    if ($targetCommit -notmatch "^[0-9a-f]{40}$") {
        throw "El VPS no devolvió un commit válido para la release seleccionada."
    }

    try {
        Test-PublicSite -ExpectedCommit $targetCommit
    }
    catch {
        $validationMessage = $_.Exception.Message
        if ($changed -and $previousPath -match "^/var/www/portfolio/releases/(\d{8}T\d{6}Z-[0-9a-f]{7,40})$") {
            $previousId = $Matches[1]
            try {
                Restore-RemoteRelease -ReleaseId $previousId -ExpectedCurrentId $ReleaseId |
                    ForEach-Object { Write-Host $_ }
            }
            catch {
                throw "Falló la comprobación pública y current cambió o no pudo restaurarse de forma segura: $validationMessage"
            }
            throw "Falló la comprobación pública del rollback; se restauró $previousId`: $validationMessage"
        }
        if (-not $changed) {
            throw "La release ya estaba activa, pero no superó la comprobación pública: $validationMessage"
        }
        throw "Falló la comprobación pública y no se pudo identificar con seguridad el enlace anterior: $validationMessage"
    }
}

if ($DryRun) {
    Show-DryRunPlan
    return
}

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
if (-not (Test-Path -LiteralPath $KeyPath -PathType Leaf)) {
    throw "La clave SSH no existe o no es un archivo: $KeyPath"
}
$keyFile = (Resolve-Path -LiteralPath $KeyPath).Path
$script:sshExecutable = Resolve-NativeCommand -Name "ssh"
$script:sshTarget = "$RemoteUser@$HostName"
$script:sshArguments = @(
    "-T",
    "-i", $keyFile,
    "-p", $Port.ToString(),
    "-o", "BatchMode=yes",
    "-o", "IdentitiesOnly=yes",
    "-o", "StrictHostKeyChecking=yes",
    "-o", "ConnectTimeout=10",
    "-o", "ServerAliveInterval=15",
    "-o", "ServerAliveCountMax=2"
)

if ($PSCmdlet.ParameterSetName -eq "Rollback") {
    Invoke-Rollback -ReleaseId $RollbackTo
    Write-Host "Rollback completado y verificado."
    return
}

$script:scpExecutable = Resolve-NativeCommand -Name "scp"
$gitExecutable = Resolve-NativeCommand -Name "git"
$nodeExecutable = Resolve-NativeCommand -Name "node"
$npmExecutable = Resolve-NativeCommand -Name "npm"
$tarExecutable = Resolve-NativeCommand -Name "tar"

$archivePath = $null
$remoteUpload = $null
$previousRelease = $null

Push-Location $repoRoot
try {
    $resolvedRoot = (Invoke-NativeCapture -FilePath $gitExecutable -Arguments @("rev-parse", "--show-toplevel") | Select-Object -First 1).ToString().Trim()
    if ((Resolve-Path $resolvedRoot).Path -ne $repoRoot) {
        throw "El script debe ejecutarse desde el repositorio portfolio-web."
    }

    $branch = (Invoke-NativeCapture -FilePath $gitExecutable -Arguments @("branch", "--show-current") | Select-Object -First 1).ToString().Trim()
    if ($branch -ne "main") {
        throw "Solo se permite desplegar desde la rama main."
    }

    $worktreeState = @(Invoke-NativeCapture -FilePath $gitExecutable -Arguments @("status", "--porcelain=v1", "--untracked-files=all"))
    if ($worktreeState.Count -gt 0 -and ($worktreeState -join "").Trim().Length -gt 0) {
        throw "El repositorio tiene cambios sin registrar. Haz commit antes de desplegar."
    }

    Invoke-Native -FilePath $gitExecutable -Arguments @("fetch", "--quiet", "origin", "main")
    $commit = (Invoke-NativeCapture -FilePath $gitExecutable -Arguments @("rev-parse", "HEAD") | Select-Object -First 1).ToString().Trim().ToLowerInvariant()
    $originCommit = (Invoke-NativeCapture -FilePath $gitExecutable -Arguments @("rev-parse", "origin/main") | Select-Object -First 1).ToString().Trim().ToLowerInvariant()
    if ($commit -notmatch "^[0-9a-f]{40}$" -or $commit -ne $originCommit) {
        throw "HEAD debe coincidir exactamente con origin/main antes del despliegue."
    }

    $nodeVersionText = (Invoke-NativeCapture -FilePath $nodeExecutable -Arguments @("--version") | Select-Object -First 1).ToString().TrimStart("v")
    $nodeVersion = [Version]$nodeVersionText
    if ($nodeVersion -lt [Version]"22.13.0") {
        throw "Se requiere Node.js 22.13.0 o superior."
    }

    if (-not $SkipInstall) {
        Invoke-Native -FilePath $npmExecutable -Arguments @("ci", "--ignore-scripts")
    }
    Invoke-Native -FilePath $npmExecutable -Arguments @("test")
    Invoke-Native -FilePath $npmExecutable -Arguments @("run", "typecheck")
    Invoke-Native -FilePath $npmExecutable -Arguments @("run", "lint")
    if (-not $SkipAudit) {
        Invoke-Native -FilePath $npmExecutable -Arguments @("audit", "--audit-level=high")
    }

    $deployRoot = Join-Path $repoRoot "deploy"
    foreach ($relativeFile in $requiredRelativeFiles) {
        $requiredPath = Join-Path $deployRoot $relativeFile
        if (-not (Test-Path -LiteralPath $requiredPath -PathType Leaf)) {
            throw "Falta el archivo obligatorio deploy/$relativeFile."
        }
    }

    $deployRootItem = Get-Item -LiteralPath $deployRoot -Force
    if ($deployRootItem.LinkType) {
        throw "deploy/ no puede ser un enlace simbólico ni un reparse point."
    }
    $links = @(Get-ChildItem -LiteralPath $deployRoot -Recurse -Force | Where-Object { $_.LinkType })
    if ($links.Count -gt 0) {
        throw "deploy/ no puede contener enlaces simbólicos ni reparse points."
    }

    $package = Get-Content -Raw -LiteralPath (Join-Path $repoRoot "package.json") | ConvertFrom-Json
    $version = Get-Content -Raw -LiteralPath (Join-Path $deployRoot "site-version.json") | ConvertFrom-Json
    if ($version.site -ne "cristobal-vergara-portfolio" -or $version.version -ne $package.version -or $version.commit -ne $commit) {
        throw "site-version.json no coincide con package.json y HEAD."
    }

    $releaseId = "{0}-{1}" -f [DateTime]::UtcNow.ToString("yyyyMMddTHHmmssZ"), $commit.Substring(0, 7)
    $deploymentNonce = [Guid]::NewGuid().ToString("N")
    $archivePath = Join-Path ([IO.Path]::GetTempPath()) "portfolio-web-$releaseId-$deploymentNonce.tar.gz"
    Invoke-Native -FilePath $tarExecutable -Arguments @("-czf", $archivePath, "-C", $deployRoot, ".")
    $archiveHash = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash.ToLowerInvariant()

    if ($ValidateOnly) {
        Write-Host "Validación local completada; no se contactó el VPS ($releaseId)."
        return
    }

    $remoteUpload = "/home/deploy/.portfolio-upload-$releaseId-$deploymentNonce.tar.gz"

    $scpArguments = @(
        "-i", $keyFile,
        "-P", $Port.ToString(),
        "-o", "BatchMode=yes",
        "-o", "IdentitiesOnly=yes",
        "-o", "StrictHostKeyChecking=yes",
        "-o", "ConnectTimeout=10",
        $archivePath,
        "${script:sshTarget}:$remoteUpload"
    )
    Invoke-Native -FilePath $script:scpExecutable -Arguments $scpArguments

    $deployScript = @'
set -Eeuo pipefail
umask 022

root='/var/www/portfolio'
releases="$root/releases"
release_id='__RELEASE_ID__'
expected_commit='__EXPECTED_COMMIT__'
expected_hash='__EXPECTED_HASH__'
nonce='__NONCE__'
upload='/home/deploy/.portfolio-upload-__RELEASE_ID__-__NONCE__.tar.gz'
staging="$releases/.staging-$release_id-$nonce"
release="$releases/$release_id"
next="$root/.current-$release_id-$$"
restore="$root/.restore-$release_id-$$"
switched=0
release_created=0
previous=''

cleanup() {
    code=$?
    trap - EXIT HUP INT TERM
    rm -f -- "$upload" "$next" "$restore"
    if test -d "$staging"; then
        case "$staging" in "$releases"/.staging-"$release_id"-"$nonce") rm -rf -- "$staging" ;; esac
    fi
    if test "$code" -ne 0 && test "$switched" -eq 0 && test "$release_created" -eq 1; then
        case "$release" in "$releases"/"$release_id") rm -rf -- "$release" ;; esac
    fi
    if test "$code" -ne 0 && test "$switched" -eq 1 && test -d "$previous"; then
        ln -s "$previous" "$restore"
        mv -Tf -- "$restore" "$root/current"
    fi
    exit "$code"
}
trap cleanup EXIT
trap 'exit 129' HUP
trap 'exit 130' INT
trap 'exit 143' TERM

test "$(id -un)" = 'deploy'
test "$(realpath -e -- "$root")" = "$root"
test "$(realpath -e -- "$releases")" = "$releases"
test -w "$root"
test -w "$releases"
test -f "$upload"

exec 9>"$root/.deploy.lock"
flock -n 9 || { printf 'Otro despliegue está en curso.\n' >&2; exit 75; }

test ! -e "$staging"
test ! -e "$release"

printf '%s  %s\n' "$expected_hash" "$upload" | sha256sum --check --status

while IFS= read -r entry; do
    clean="${entry#./}"
    case "$clean" in
        '') ;;
        /*|..|../*|*/../*|*/..) printf 'Ruta insegura en el paquete: %s\n' "$entry" >&2; exit 77 ;;
    esac
done < <(tar -tzf "$upload")

tar -tvzf "$upload" | awk '
    substr($0, 1, 1) != "-" && substr($0, 1, 1) != "d" { bad = 1 }
    END { exit bad ? 1 : 0 }
' || { printf 'El paquete contiene un tipo de archivo no permitido.\n' >&2; exit 78; }

mkdir "$staging"
tar --extract --gzip --file "$upload" --directory "$staging" \
    --no-same-owner --no-same-permissions

test -f "$staging/index.html"
test -f "$staging/proyectos/machine-failure-risk-classifier/index.html"
test -f "$staging/site-version.json"
test -f "$staging/CV_Cristobal_Vergara.pdf"
test -f "$staging/cristobal-vergara.webp"
test -f "$staging/favicon.png"
test -f "$staging/og.png"
test -f "$staging/robots.txt"
test -f "$staging/sitemap.xml"
test -z "$(find "$staging" -type l -print -quit)"
grep -Fq "\"commit\":\"$expected_commit\"" "$staging/site-version.json"

find "$staging" -type d -exec chmod 0755 {} +
find "$staging" -type f -exec chmod 0644 {} +
mv -- "$staging" "$release"
release_created=1

previous="$(readlink -f -- "$root/current")"
case "$previous" in
    "$releases"/*) ;;
    *) printf 'El enlace current apunta fuera de releases.\n' >&2; exit 76 ;;
esac

ln -s "$release" "$next"
mv -Tf -- "$next" "$root/current"
switched=1

curl_common=(
    --fail --silent --show-error --location
    --retry 2 --retry-delay 1 --connect-timeout 5 --max-time 20
    --resolve nightstrike.cloud:443:127.0.0.1
)
curl "${curl_common[@]}" --output /dev/null https://nightstrike.cloud/
curl "${curl_common[@]}" --output /dev/null \
    https://nightstrike.cloud/proyectos/machine-failure-risk-classifier/
curl "${curl_common[@]}" --output /dev/null \
    https://nightstrike.cloud/CV_Cristobal_Vergara.pdf
version_payload="$(curl "${curl_common[@]}" https://nightstrike.cloud/site-version.json)"
printf '%s' "$version_payload" | grep -Fq "\"commit\":\"$expected_commit\""

rm -f -- "$upload" "$next" "$restore"
trap - EXIT HUP INT TERM
printf 'PREVIOUS=%s\nCURRENT=%s\n' "$previous" "$release"
'@.Replace("__RELEASE_ID__", $releaseId).
        Replace("__EXPECTED_COMMIT__", $commit).
        Replace("__EXPECTED_HASH__", $archiveHash).
        Replace("__NONCE__", $deploymentNonce)

    $activationOutput = Invoke-RemoteScript -BashScript $deployScript
    $activationOutput | ForEach-Object {
        Write-Host $_
        if ($_ -match "^PREVIOUS=(.+)$") {
            $previousRelease = $Matches[1]
        }
    }

    try {
        Test-PublicSite -ExpectedCommit $commit
    }
    catch {
        $validationMessage = $_.Exception.Message
        $restored = $false
        if ($previousRelease -match "^/var/www/portfolio/releases/(\d{8}T\d{6}Z-[0-9a-f]{7,40})$") {
            $previousId = $Matches[1]
            Write-Warning "Falló la comprobación externa; restaurando $previousId."
            try {
                Restore-RemoteRelease -ReleaseId $previousId -ExpectedCurrentId $releaseId |
                    ForEach-Object { Write-Host $_ }
                $restored = $true
            }
            catch {
                throw "Falló la comprobación pública y current cambió o no pudo restaurarse de forma segura: $validationMessage"
            }
        }
        if ($restored) {
            throw "El despliegue no superó la comprobación pública y se restauró $previousId`: $validationMessage"
        }
        throw "El despliegue no superó la comprobación pública y no se pudo identificar con seguridad la release anterior: $validationMessage"
    }

    Write-Host "Despliegue completado: $publicOrigin ($releaseId)."
}
catch {
    if ($remoteUpload) {
        try {
            $cleanupScript = "set -euo pipefail`nrm -f -- '$remoteUpload'`n"
            Invoke-RemoteScript -BashScript $cleanupScript | Out-Null
        }
        catch {
            Write-Warning "No se pudo confirmar la limpieza del archivo temporal remoto."
        }
    }
    throw
}
finally {
    Pop-Location
    if ($archivePath -and (Test-Path -LiteralPath $archivePath -PathType Leaf)) {
        Remove-Item -LiteralPath $archivePath -Force
    }
}
