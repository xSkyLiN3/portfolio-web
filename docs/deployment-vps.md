# Despliegue del portafolio en el VPS

## Alcance

`nightstrike.cloud` se publica como un sitio estático. El VPS no compila el proyecto, no ejecuta Node.js y no contiene el repositorio: Nginx sirve el enlace `/var/www/portfolio/current`, que apunta a una release inmutable dentro de `/var/www/portfolio/releases`.

El despliegue es manual y deliberado. GitHub Actions verifica cada cambio y conserva el resultado estático como artefacto, pero no tiene credenciales de producción ni publica automáticamente.

## Requisitos

- PowerShell 7.2 o superior.
- Node.js 22.13 o superior, npm, Git, OpenSSH y `tar`.
- Rama `main` limpia y sincronizada exactamente con `origin/main`.
- CI verde para el commit que se va a publicar.
- Clave privada local en `%USERPROFILE%\.ssh\id_ed25519`.
- Huella del VPS ya verificada en `known_hosts` mediante una conexión SSH manual.
- Usuario remoto `deploy`; nunca se usa `root` para publicar.

La cuenta `deploy` autentica únicamente por clave, no pertenece a `sudo` ni a `docker` y solo puede escribir en `/var/www/portfolio` mediante el grupo `portfolio-deploy`.

## Revisar el plan sin ejecutar acciones

```powershell
.\scripts\deploy-vps.ps1 -DryRun
```

Este modo no ejecuta Git, npm, SSH, `tar`, DNS ni solicitudes HTTP. Solo muestra el orden y el alcance de las operaciones previstas.
Por diseño es únicamente una vista previa: no valida la clave, las herramientas ni el estado del entorno.

Para ejecutar todas las comprobaciones, compilar y validar el paquete sin contactar el VPS:

```powershell
.\scripts\deploy-vps.ps1 -ValidateOnly
```

## Publicar una release

Después de confirmar que GitHub Actions terminó correctamente:

```powershell
.\scripts\deploy-vps.ps1
```

El script:

1. exige `main`, un worktree limpio y `HEAD == origin/main`;
2. reproduce las comprobaciones de CI;
3. valida `deploy/` y su `site-version.json`;
4. rechaza enlaces simbólicos y tipos de archivo inseguros;
5. crea un paquete temporal y comprueba su SHA-256 en el VPS;
6. extrae en `releases/<fecha-UTC>-<commit-corto>` sin sobrescribir releases;
7. sustituye `current` mediante un enlace simbólico atómico;
8. comprueba portada, caso de estudio, CV y versión desde el VPS y desde Internet;
9. restaura automáticamente la release anterior si falla la comprobación.

Por defecto también ejecuta `npm ci --ignore-scripts` y `npm audit --audit-level=high`. Para una repetición local en la que las dependencias ya están instaladas o la auditoría ya fue confirmada por CI, existen `-SkipInstall` y `-SkipAudit`.

No se reinicia Nginx porque el cambio de release se realiza a través del enlace `current`.

## Consultar releases y versión activa

```powershell
ssh -i "$env:USERPROFILE\.ssh\id_ed25519" deploy@72.60.61.126 `
  'readlink -f /var/www/portfolio/current; find /var/www/portfolio/releases -mindepth 1 -maxdepth 1 -type d -printf "%f\n" | sort'
```

Cada nombre debe tener el formato `AAAAMMDDTHHMMSSZ-commit`. No se debe seleccionar una release mediante posiciones como «la anterior» o mediante globs: el identificador debe copiarse completo.

## Rollback

Para activar una release concreta:

```powershell
.\scripts\deploy-vps.ps1 -RollbackTo 20260820T030845Z-e59a01b
```

El rollback valida que el destino exista y contenga los archivos públicos obligatorios, cambia `current` atómicamente y repite las comprobaciones web. Si estas fallan, restaura el enlace que estaba activo antes del intento.

Para inspeccionar el plan sin tocar el VPS:

```powershell
.\scripts\deploy-vps.ps1 -RollbackTo 20260820T030845Z-e59a01b -DryRun
```

## Diagnóstico

Comprobar acceso y permisos sin modificar el servidor:

```powershell
ssh -i "$env:USERPROFILE\.ssh\id_ed25519" -o BatchMode=yes `
  deploy@72.60.61.126 `
  'id; test -w /var/www/portfolio; test -w /var/www/portfolio/releases; readlink -f /var/www/portfolio/current'
```

Comprobar los recursos públicos:

```powershell
$paths = '/', '/proyectos/machine-failure-risk-classifier/', '/site-version.json', '/CV_Cristobal_Vergara.pdf'
foreach ($path in $paths) {
    (Invoke-WebRequest "https://nightstrike.cloud$path").StatusCode
}
```

Si la clave de host cambia inesperadamente, no debe desactivarse `StrictHostKeyChecking` ni borrarse `known_hosts` sin investigar primero la causa.

## Reglas operativas

- No editar archivos dentro de una release existente.
- No copiar contraseñas, claves privadas, `.env` ni código fuente al VPS.
- No conceder `sudo`, acceso a Docker ni permisos generales sobre `/var/www` a `deploy`.
- No hacer depender el portafolio de la disponibilidad de otros subdominios.
- No borrar releases automáticamente. La limpieza debe ser una operación independiente, revisando el destino exacto y conservando siempre la release activa y al menos una opción de rollback verificada.
- Toda ruta pública nueva debe añadirse a `scripts/export-static.mjs`, al sitemap y a las pruebas antes de desplegar.

## Relación con OpenAI Sites

`.openai/hosting.json` se conserva para compatibilidad con el entorno de desarrollo. El dominio y el flujo canónicos siguen siendo el VPS y `nightstrike.cloud`; esta guía no publica una segunda copia del portafolio.
