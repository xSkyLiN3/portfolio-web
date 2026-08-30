# Portafolio de Cristóbal Vergara

[![CI](https://github.com/xSkyLiN3/portfolio-web/actions/workflows/ci.yml/badge.svg)](https://github.com/xSkyLiN3/portfolio-web/actions/workflows/ci.yml)

Web personal y CV profesional de [Cristóbal Vergara](https://nightstrike.cloud), estudiante de Ingeniería en Informática con tres releases públicas en machine learning, forecasting e ingeniería full-stack, y una dirección de aprendizaje hacia AI/ML Engineering.

![Vista social del portafolio](public/og.png)

## Enfoque

El sitio está diseñado para presentar evidencia sin exagerar el nivel profesional actual:

- AI/ML se comunica como dirección profesional en desarrollo, no como cargo alcanzado.
- Machine Failure Risk Classifier es el proyecto principal: demo pública, código, Model Card y release v1.0.1 verificables.
- Sus métricas se presentan junto a su contexto: holdout final reservado de 2.000 filas y dataset sintético sin validación industrial.
- Retail Demand Forecasting publica una decisión no-go después de fallar el guardrail de cobertura del holdout.
- RutaCuadrilla demuestra reglas transaccionales e interfaces por rol con una demo local completamente sintética.
- Operación Control aparece como piloto privado.
- Weapon Inspector aparece como proyecto histórico secundario con código y release públicos.
- No se publican accesos internos, RUT, dirección particular ni datos operativos.

## Contenido

- Presentación y posicionamiento profesional.
- Estado real de cinco proyectos propios, con tres releases públicas priorizadas.
- Tres casos de estudio verificables, con metodología, resultados y límites.
- Trayectoria desde fundamentos de software hacia datos y machine learning.
- Tecnologías agrupadas por evidencia de uso.
- Formación universitaria y credencial pública de Kaggle.
- CV de una página, descargable y compatible con ATS.
- Contacto mediante correo, LinkedIn y GitHub.

## Stack

- React 19
- TypeScript
- vinext y Vite
- CSS responsivo sin librerías de componentes
- GitHub Actions para compilación y pruebas

## Desarrollo local

Requiere Node.js 22.13 o superior.

```bash
npm ci
npm run dev
```

La aplicación queda disponible en `http://localhost:3000`.

## Verificación

```bash
npm test
npm run lint
```

Las pruebas compilan el sitio, renderizan la portada y el caso de estudio, y comprueban el contenido profesional, los metadatos, la ausencia de datos sensibles y los recursos públicos.

Para producir el paquete estático usado por el VPS:

```bash
npm run export:static
```

El resultado se genera en `deploy/`. El sitio público no necesita Node.js, base de datos ni un proceso de aplicación en el servidor.

El destino canónico es el VPS en `nightstrike.cloud`, publicado como una release estática e inmutable. La configuración de OpenAI Sites se conserva para compatibilidad de desarrollo, pero no sustituye el dominio principal.

## Despliegue en VPS

El sitio canónico se publica mediante el usuario SSH restringido `deploy`:

```powershell
.\scripts\deploy-vps.ps1
```

El script verifica el proyecto, genera `deploy/`, crea una release versionada y actualiza atómicamente el enlace `current`. El procedimiento, las comprobaciones y el rollback están documentados en [docs/deployment-vps.md](docs/deployment-vps.md).

## Mantener el CV

La fuente aprobada está en `cv/CV_Cristobal_Vergara_ATS.docx` y la exportación pública en
`public/CV_Cristobal_Vergara.pdf`. El documento es de una página, una sola columna y no usa
tablas, fotografía ni RUT.

Cada actualización debe editar primero el DOCX, exportar un PDF nuevo y comprobar visualmente
la página completa y el orden del texto antes de reemplazar ambos archivos. El PDF no debe
regenerarse desde fuentes históricas del CV.

## Estructura principal

```text
app/                 página, layout y sistema visual
cv/                  fuente ATS editable del currículum
docs/                guía operativa de despliegue y rollback
public/              fotografía, CV, favicon y tarjeta social
scripts/             exportación y despliegue
tests/               comprobaciones del HTML renderizado
.openai/hosting.json compatibilidad con el entorno de desarrollo
```

## Licencia y contenido personal

El código fuente se publica bajo licencia MIT. La fotografía, el CV, los textos biográficos y demás contenido personal no forman parte de esa licencia y no pueden reutilizarse para suplantación, entrenamiento de perfiles o representación de otra persona.
