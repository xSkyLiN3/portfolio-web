import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const caseStudyPath = "/proyectos/rutacuadrilla";

export const metadata: Metadata = {
  title: "Caso de estudio — RutaCuadrilla",
  description:
    "Caso full-stack geoespacial con asignación de rutas, reglas transaccionales, control de concurrencia y una demo reproducible con datos sintéticos.",
  alternates: {
    canonical: `${caseStudyPath}/`,
  },
  openGraph: {
    type: "article",
    url: `${caseStudyPath}/`,
    title: "Caso de estudio — RutaCuadrilla",
    description:
      "Interfaces por rol, reglas de asignación y trazabilidad para un prototipo de operaciones en terreno completamente separado del piloto privado.",
    images: [
      {
        url: "https://nightstrike.cloud/projects/rutacuadrilla-admin.png",
        width: 1280,
        height: 720,
        alt: "Panel sintético de seguimiento de RutaCuadrilla",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caso de estudio — RutaCuadrilla",
    description:
      "Prototipo full-stack geoespacial con reglas transaccionales y demo sintética reproducible.",
    images: ["https://nightstrike.cloud/projects/rutacuadrilla-admin.png"],
  },
};

export default function RutaCuadrillaCaseStudy() {
  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>

      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" href="/" aria-label="Volver al inicio del portafolio">
            <span className="brand-mark" aria-hidden="true">CV</span>
            <span>Cristóbal Vergara</span>
          </Link>
          <nav className="main-nav" aria-label="Navegación del caso de estudio">
            <a href="#reto">Reto</a>
            <a href="#flujo">Flujo</a>
            <a href="#ingenieria">Ingeniería</a>
            <a href="#limites">Límites</a>
          </nav>
          <Link className="header-cta" href="/#proyectos">Volver a proyectos</Link>
        </div>
      </header>

      <main id="contenido" className="case-main">
        <section className="case-hero">
          <div className="case-hero-copy">
            <p className="eyebrow">CASO DE ESTUDIO · RELEASE 0.1.0</p>
            <h1>Coordinar trabajo de campo sin perder el estado canónico.</h1>
            <p className="case-lede">
              RutaCuadrilla es un prototipo full-stack para asignar recorridos,
              aislar el trabajo de cada operador y registrar el avance punto por
              punto. La edición pública reproduce el flujo completo con geometrías
              y personas ficticias, sin reutilizar información del piloto privado.
            </p>
            <div className="hero-actions">
              <a
                className="button primary"
                href="https://github.com/xSkyLiN3/rutacuadrilla/releases/tag/v0.1.0"
                target="_blank"
                rel="noreferrer"
              >
                Revisar release <span aria-hidden="true">↗</span>
              </a>
              <a
                className="button secondary"
                href="https://github.com/xSkyLiN3/rutacuadrilla"
                target="_blank"
                rel="noreferrer"
              >
                Ver código <span aria-hidden="true">↗</span>
              </a>
              <a
                className="text-link"
                href="https://github.com/xSkyLiN3/rutacuadrilla/tree/v0.1.0#demo-local-reproducible"
                target="_blank"
                rel="noreferrer"
              >
                Ejecutar demo local <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <aside className="case-summary" aria-label="Ficha del proyecto">
            <p className="case-summary-label">FICHA RÁPIDA</p>
            <dl>
              <div><dt>Rol</dt><dd>Proyecto individual</dd></div>
              <div><dt>Alcance</dt><dd>Dominio · API · dos interfaces · datos</dd></div>
              <div><dt>Datos públicos</dt><dd>100 % sintéticos y reproducibles</dd></div>
              <div><dt>Stack</dt><dd>TypeScript · React · Fastify · PostgreSQL</dd></div>
              <div>
                <dt>Estado</dt>
                <dd><span className="status status-public">Prototipo funcional publicado</span></dd>
              </div>
            </dl>
          </aside>
        </section>

        <section className="case-metrics" aria-label="Alcance demostrable">
          <div><strong>72</strong><span>puntos ficticios</span></div>
          <div><strong>12</strong><span>segmentos sintéticos</span></div>
          <div><strong>2</strong><span>interfaces adaptadas por rol</span></div>
          <div><strong>1 → 2 vistas</strong><span>una visita actualiza Campo y Administración</span></div>
        </section>

        <section className="case-section section-shell" id="reto" aria-labelledby="route-challenge-title">
          <div className="case-section-heading">
            <p className="eyebrow">01 · RETO</p>
            <h2 id="route-challenge-title">Más que un CRUD con un mapa.</h2>
          </div>
          <div className="case-content">
            <p className="case-intro">
              Un recorrido no puede asignarse como una colección de filas aisladas.
              El sistema debe impedir solapamientos, mantener una sola asignación
              activa por usuario y aceptar reintentos sin duplicar efectos.
            </p>
            <p>
              Campo y Administración observan el mismo estado desde perspectivas
              distintas. Las reglas sensibles viven en servidor y base de datos:
              la interfaz no decide por sí sola a qué ruta pertenece un operador ni
              cuál versión de una visita es válida.
            </p>

            <div className="case-media-grid">
              <figure className="case-figure">
                <Image
                  src="/projects/rutacuadrilla-admin.png"
                  alt="Panel de Administración con el avance sintético de una ruta"
                  width={1280}
                  height={720}
                  unoptimized
                />
                <figcaption>
                  Administración resume el estado canónico después de una visita de prueba.
                </figcaption>
              </figure>
              <figure className="case-figure">
                <Image
                  src="/projects/rutacuadrilla-field.png"
                  alt="Interfaz móvil de Campo con mapa y resumen de una ruta sintética"
                  width={375}
                  height={844}
                  unoptimized
                />
                <figcaption>
                  Campo presenta mapa y lista para una ruta de 72 puntos ficticios.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="case-section section-shell" id="flujo" aria-labelledby="route-flow-title">
          <div className="case-section-heading">
            <p className="eyebrow">02 · FLUJO</p>
            <h2 id="route-flow-title">Una operación completa y reproducible.</h2>
          </div>
          <div className="case-content">
            <p className="case-intro">
              El comando de demo comprueba el entorno, levanta API y ambas
              interfaces, espera readiness y carga una ruta determinista. Repetirlo
              no mezcla datos ni sobrescribe una configuración local diferente.
            </p>
            <ol className="case-flow" aria-label="Flujo demostrable de RutaCuadrilla">
              <li><span>01</span><h3>Generar</h3><p>Semilla fija produce puntos, segmentos, predios, huellas y manifiesto SHA-256.</p></li>
              <li><span>02</span><h3>Publicar</h3><p>La importación CSV y la publicación de la ruta son idempotentes.</p></li>
              <li><span>03</span><h3>Asignar</h3><p>Exclusividad y pertenencia se validan de forma transaccional.</p></li>
              <li><span>04</span><h3>Visitar</h3><p>Campo registra uno de seis resultados operacionales permitidos.</p></li>
              <li><span>05</span><h3>Resolver</h3><p>Versiones optimistas convierten una edición obsoleta en conflicto explícito.</p></li>
              <li><span>06</span><h3>Observar</h3><p>Administración recibe el avance agregado del mismo estado canónico.</p></li>
            </ol>

            <div className="case-fact">
              <span>PRUEBA E2E</span>
              <p>
                Registrar una visita en Campo cambió el contador de Administración
                de 0/72 a 1/72. La ejecución utilizó únicamente la ruta sintética
                incluida en la release pública.
              </p>
            </div>
          </div>
        </section>

        <section className="case-section section-shell" id="ingenieria" aria-labelledby="route-engineering-title">
          <div className="case-section-heading">
            <p className="eyebrow">03 · INGENIERÍA</p>
            <h2 id="route-engineering-title">Las reglas del dominio no dependen del navegador.</h2>
          </div>
          <div className="case-content">
            <div className="case-grid">
              <article className="case-panel"><p className="card-eyebrow">CONCURRENCIA</p><h3>Actualización optimista</h3><p>Cada cambio presenta su versión esperada; un estado obsoleto genera una respuesta de conflicto.</p></article>
              <article className="case-panel"><p className="card-eyebrow">IDEMPOTENCIA</p><h3>Reintentos sin duplicados</h3><p>Importación, publicación y comandos críticos mantienen una identidad estable ante repeticiones.</p></article>
              <article className="case-panel"><p className="card-eyebrow">AISLAMIENTO</p><h3>Permisos en servidor</h3><p>Sesiones revocables, pertenencia de ruta y rate limiting protegen los flujos expuestos.</p></article>
              <article className="case-panel"><p className="card-eyebrow">TRAZABILIDAD</p><h3>Migraciones y auditoría</h3><p>La persistencia PostgreSQL registra cambios y acompaña backups con restauración verificada.</p></article>
              <article className="case-panel"><p className="card-eyebrow">INTERFAZ</p><h3>Dos superficies por rol</h3><p>Administración prioriza asignación y seguimiento; Campo prioriza avance móvil, mapa y lista.</p></article>
              <article className="case-panel"><p className="card-eyebrow">CALIDAD</p><h3>Contrato verify</h3><p>Formato, lint, tipos, secretos, datos privados, pruebas y cuatro builds se verifican en CI.</p></article>
            </div>
          </div>
        </section>

        <section className="case-section section-shell" id="limites" aria-labelledby="route-limits-title">
          <div className="case-section-heading">
            <p className="eyebrow">04 · LÍMITES</p>
            <h2 id="route-limits-title">Lo que la edición pública no promete.</h2>
          </div>
          <div className="case-content">
            <aside className="case-warning" aria-label="Limitaciones del proyecto">
              <h3>Es un prototipo funcional, no un SaaS certificado para datos sensibles.</h3>
              <ul>
                <li>No contiene identidades, direcciones, coordenadas ni polígonos del piloto privado.</li>
                <li>No optimiza recorridos ni utiliza inteligencia artificial.</li>
                <li>El modo offline/local-first permanece como investigación técnica, fuera de la demo canónica.</li>
                <li>El mapa base externo es opcional y no se configura por defecto.</li>
                <li>Un uso real exige revisión legal, privacidad, monitoreo y seguridad independientes.</li>
              </ul>
            </aside>

            <div className="case-grid case-grid-followup">
              <article className="case-panel"><p className="card-eyebrow">SEPARACIÓN</p><h3>Portfolio y piloto no comparten datos</h3><p>La release es una copia preparada para demostración; el sistema personal desplegado no fue modificado.</p></article>
              <article className="case-panel"><p className="card-eyebrow">SIGUIENTE NIVEL</p><h3>Validación antes que nuevas funciones</h3><p>Una operación sensible necesitaría roles PostgreSQL separados, observabilidad y pruebas independientes.</p></article>
            </div>
          </div>
        </section>

        <section className="case-evidence" aria-labelledby="route-evidence-title">
          <div>
            <p className="eyebrow light">EVIDENCIA PÚBLICA</p>
            <h2 id="route-evidence-title">Ejecutar el flujo con datos sintéticos.</h2>
            <p>
              El repositorio incluye el generador determinista, las dos interfaces,
              la API, las migraciones, documentación de seguridad y el comando que
              levanta la demo local completa.
            </p>
            <div className="case-evidence-links">
              <a className="button button-light" href="https://github.com/xSkyLiN3/rutacuadrilla/releases/tag/v0.1.0" target="_blank" rel="noreferrer">Release v0.1.0 <span aria-hidden="true">↗</span></a>
              <a href="https://github.com/xSkyLiN3/rutacuadrilla" target="_blank" rel="noreferrer">Repositorio <span aria-hidden="true">↗</span></a>
              <a href="https://github.com/xSkyLiN3/rutacuadrilla/tree/v0.1.0#demo-local-reproducible" target="_blank" rel="noreferrer">Demo local <span aria-hidden="true">↗</span></a>
              <a href="https://github.com/xSkyLiN3/rutacuadrilla/blob/v0.1.0/docs/architecture.md" target="_blank" rel="noreferrer">Arquitectura <span aria-hidden="true">↗</span></a>
              <a href="https://github.com/xSkyLiN3/rutacuadrilla/blob/v0.1.0/docs/security-and-privacy.md" target="_blank" rel="noreferrer">Seguridad y privacidad <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <span>© 2026 Cristóbal Vergara</span>
          <Link className="text-link" href="/#proyectos">Volver al portafolio</Link>
        </div>
      </footer>
    </>
  );
}
