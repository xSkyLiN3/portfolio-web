import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const caseStudyPath = "/proyectos/retail-demand-forecasting";

export const metadata: Metadata = {
  title: "Caso de estudio — Retail Demand Forecasting",
  description:
    "Caso de ML engineering con backtesting temporal, intervalos, monitoreo y una decisión no-go publicada después del holdout final.",
  alternates: {
    canonical: `${caseStudyPath}/`,
  },
  openGraph: {
    type: "article",
    url: `${caseStudyPath}/`,
    title: "Caso de estudio — Retail Demand Forecasting",
    description:
      "Forecasting reproducible, gobernanza del modelo y un resultado adverso conservado como evidencia en lugar de ajustarlo después del holdout.",
    images: [
      {
        url: "https://nightstrike.cloud/projects/retail-dashboard.png",
        width: 1265,
        height: 712,
        alt: "Dashboard histórico de Retail Forecast Lab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caso de estudio — Retail Demand Forecasting",
    description:
      "Backtesting temporal, intervalos, monitoreo y una decisión no-go publicada.",
    images: ["https://nightstrike.cloud/projects/retail-dashboard.png"],
  },
};

const finalResults = [
  ["WAPE", "1,1565", "Error agregado alto; bajo el umbral de alerta provisional de 2,00"],
  ["MAE", "85,1881", "Unidades por fila SKU-día"],
  ["Sesgo normalizado", "+0,0593", "Dentro del guardrail de ±0,10"],
  ["Cobertura empírica", "77,02 %", "Falla el mínimo de 85 % y el objetivo nominal de 90 %"],
  ["Ancho medio", "192,3692", "Debe leerse junto con la cobertura insuficiente"],
  ["Winkler score", "1.105,4818", "Penaliza simultáneamente amplitud y fallos de cobertura"],
] as const;

export default function RetailDemandForecastingCaseStudy() {
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
            <a href="#proceso">Proceso</a>
            <a href="#resultados">Resultados</a>
            <a href="#limites">Límites</a>
          </nav>
          <Link className="header-cta" href="/#proyectos">Volver a proyectos</Link>
        </div>
      </header>

      <main id="contenido" className="case-main">
        <section className="case-hero">
          <div className="case-hero-copy">
            <p className="eyebrow">CASO DE ESTUDIO · RELEASE 1.0.0</p>
            <h1>Publicar un no-go también es ingeniería.</h1>
            <p className="case-lede">
              Retail Demand Forecasting &amp; Monitoring recorre un sistema de
              forecasting completo: contrato temporal, baseline, challenger,
              intervalos, holdout final, persistencia, API y monitoreo. El resultado
              final no habilitó el modelo para decisiones operacionales, y esa
              conclusión se conserva como parte central del proyecto.
            </p>
            <div className="hero-actions">
              <a
                className="button primary"
                href="https://github.com/xSkyLiN3/retail-demand-forecasting/releases/tag/v1.0.0"
                target="_blank"
                rel="noreferrer"
              >
                Revisar release <span aria-hidden="true">↗</span>
              </a>
              <a
                className="button secondary"
                href="https://github.com/xSkyLiN3/retail-demand-forecasting"
                target="_blank"
                rel="noreferrer"
              >
                Ver código <span aria-hidden="true">↗</span>
              </a>
              <a
                className="text-link"
                href="https://github.com/xSkyLiN3/retail-demand-forecasting/blob/v1.0.0/MODEL_CARD.md"
                target="_blank"
                rel="noreferrer"
              >
                Model Card <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <aside className="case-summary" aria-label="Ficha del proyecto">
            <p className="case-summary-label">FICHA RÁPIDA</p>
            <dl>
              <div><dt>Rol</dt><dd>Proyecto individual</dd></div>
              <div><dt>Alcance</dt><dd>Datos · evaluación · API · monitoreo</dd></div>
              <div><dt>Fuente</dt><dd>UCI Online Retail II · transacciones históricas</dd></div>
              <div><dt>Stack</dt><dd>Python · FastAPI · PostgreSQL · Docker</dd></div>
              <div>
                <dt>Estado</dt>
                <dd><span className="status status-private">No aprobado para operación</span></dd>
              </div>
            </dl>
          </aside>
        </section>

        <section className="case-metrics" aria-label="Resultados principales">
          <div><strong>77,02 %</strong><span>cobertura final observada</span></div>
          <div><strong>85 %</strong><span>guardrail mínimo predefinido</span></div>
          <div><strong>52</strong><span>alertas publicadas</span></div>
          <div><strong>1.680</strong><span>pronósticos evaluados</span></div>
        </section>

        <section className="case-section section-shell" id="reto" aria-labelledby="retail-challenge-title">
          <div className="case-section-heading">
            <p className="eyebrow">01 · RETO</p>
            <h2 id="retail-challenge-title">Evaluar demanda sin fingir que las ventas cuentan toda la historia.</h2>
          </div>
          <div className="case-content">
            <p className="case-intro">
              La fuente contiene facturas históricas de un retailer británico sin
              tienda física. El objetivo se definió como unidades positivas
              facturadas por SKU y día: un proxy observable, no demanda irrestricta.
            </p>
            <p>
              No hay información confiable de inventario, quiebres de stock,
              promociones, cumplimiento ni ventas perdidas. El problema exigía
              ordenar el tiempo correctamente, mantener el holdout fuera del ajuste
              y evitar que una mejora promedio escondiera sesgo o deterioro por SKU.
            </p>
            <figure className="case-figure">
              <Image
                src="/projects/retail-dashboard.png"
                alt="Dashboard de Retail Forecast Lab mostrando cobertura, WAPE, sesgo y pronósticos observados"
                width={1265}
                height={712}
                unoptimized
              />
              <figcaption>
                Replay histórico de solo lectura. No está conectado a un retailer
                vivo ni validado para compras o inventario.
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="case-section section-shell" id="proceso" aria-labelledby="retail-process-title">
          <div className="case-section-heading">
            <p className="eyebrow">02 · PROCESO</p>
            <h2 id="retail-process-title">Congelar decisiones antes de conocer el resultado final.</h2>
          </div>
          <div className="case-content">
            <p className="case-intro">
              El proyecto separa desarrollo, confirmación, calibración de intervalos
              y holdout. Cada fase conserva manifiestos y hashes para que repetir el
              software no signifique reabrir evidencia usada para decidir.
            </p>
            <ol className="case-flow" aria-label="Flujo de evaluación de forecasting">
              <li><span>01</span><h3>Contrato de datos</h3><p>Fuente, cohortes, panel diario y reglas temporales documentadas.</p></li>
              <li><span>02</span><h3>Baseline fuerte</h3><p>Seasonal naive de siete días evaluado en folds rolling-origin.</p></li>
              <li><span>03</span><h3>Gate de promoción</h3><p>Error, sesgo, consistencia y amplitud por SKU deciden el champion.</p></li>
              <li><span>04</span><h3>Intervalos congelados</h3><p>Calibración por horizonte sin usar resultados del holdout final.</p></li>
              <li><span>05</span><h3>Apertura única</h3><p>La ventana final se evalúa una vez mediante contrato y recibo.</p></li>
              <li><span>06</span><h3>Replay y monitoreo</h3><p>API, persistencia y dashboard reconstruyen la evidencia histórica.</p></li>
            </ol>

            <div className="case-grid">
              <article className="case-panel">
                <p className="card-eyebrow">SELECCIÓN</p>
                <h3>Una mejora agregada no bastó</h3>
                <p>El challenger redujo WAPE 11,94 %, pero alcanzó 14,77 % de sesgo absoluto y solo mejoró 10 de 20 productos.</p>
              </article>
              <article className="case-panel">
                <p className="card-eyebrow">CHAMPION</p>
                <h3>El baseline conservó el rol</h3>
                <p>Seasonal naive permaneció como champion porque el candidato no cumplió todas las reglas predefinidas.</p>
              </article>
              <article className="case-panel">
                <p className="card-eyebrow">INTEGRIDAD</p>
                <h3>Contratos con identidad</h3>
                <p>Panel, cohorte, evidencia previa y árbol de código se verifican antes de abrir la evaluación final.</p>
              </article>
              <article className="case-panel">
                <p className="card-eyebrow">PRODUCTO</p>
                <h3>Resultado consultable</h3>
                <p>FastAPI, PostgreSQL/JSON y un dashboard permiten revisar pronósticos, outcomes y alertas ya sellados.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="case-section section-shell" id="resultados" aria-labelledby="retail-results-title">
          <div className="case-section-heading">
            <p className="eyebrow">03 · RESULTADOS</p>
            <h2 id="retail-results-title">El holdout rechazó los intervalos.</h2>
          </div>
          <div className="case-content">
            <div className="case-table-wrap">
              <table className="case-table">
                <caption>Evaluación final sobre 20 SKU, 14 horizontes y 6 orígenes</caption>
                <thead>
                  <tr><th scope="col">Métrica</th><th scope="col">Resultado</th><th scope="col">Lectura predeclarada</th></tr>
                </thead>
                <tbody>
                  {finalResults.map(([metric, value, meaning]) => (
                    <tr key={metric}><th scope="row">{metric}</th><td>{value}</td><td>{meaning}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>

            <figure className="case-figure">
              <Image
                src="/projects/retail-coverage.svg"
                alt="Cobertura del holdout por horizonte de pronóstico, por debajo del objetivo nominal"
                width={960}
                height={540}
                unoptimized
              />
              <figcaption>
                La cobertura insuficiente aparece en la evidencia versionada y no
                se reutiliza como señal para reajustar esta misma release.
              </figcaption>
            </figure>

            <div className="case-result-callout">
              <p className="card-eyebrow">DECISIÓN PUBLICADA</p>
              <strong>degraded_with_published_alerts · no-go operacional</strong>
              <p>
                Se emitieron 52 alertas en los niveles global, horizonte y SKU. El
                resultado demuestra el proceso de evaluación y monitoreo, no la
                calidad necesaria para automatizar compras.
              </p>
            </div>
          </div>
        </section>

        <section className="case-section section-shell" aria-labelledby="retail-engineering-title">
          <div className="case-section-heading">
            <p className="eyebrow">04 · INGENIERÍA</p>
            <h2 id="retail-engineering-title">La evidencia también tiene arquitectura.</h2>
          </div>
          <div className="case-content">
            <div className="case-grid">
              <article className="case-panel"><p className="card-eyebrow">TEMPORALIDAD</p><h3>Backtesting rolling-origin</h3><p>Veinte folds no solapados y una ventana final de 84 días separan aprendizaje y evaluación.</p></article>
              <article className="case-panel"><p className="card-eyebrow">PERSISTENCIA</p><h3>JSON y PostgreSQL</h3><p>Repositorios intercambiables conservan inserciones atómicas, reconciliación e idempotencia.</p></article>
              <article className="case-panel"><p className="card-eyebrow">CALIDAD</p><h3>Pruebas de integridad</h3><p>La release revisada pasa 103 pruebas, lint, builds y smoke tests del stack PostgreSQL.</p></article>
              <article className="case-panel"><p className="card-eyebrow">ENTREGA</p><h3>Demo contenida</h3><p>Docker Compose expone solo la API en localhost y carga un snapshot histórico de solo lectura.</p></article>
            </div>
          </div>
        </section>

        <section className="case-section section-shell" id="limites" aria-labelledby="retail-limits-title">
          <div className="case-section-heading">
            <p className="eyebrow">05 · LÍMITES</p>
            <h2 id="retail-limits-title">Lo que este resultado no permite afirmar.</h2>
          </div>
          <div className="case-content">
            <aside className="case-warning" aria-label="Limitaciones del proyecto">
              <h3>No está aprobado para compras, inventario ni decisiones comerciales.</h3>
              <ul>
                <li>Las ventas facturadas son un proxy incompleto de demanda.</li>
                <li>Faltan inventario, stockouts, promociones, cumplimiento y ventas perdidas.</li>
                <li>La cobertura final incumple tanto el mínimo como el objetivo nominal.</li>
                <li>El holdout publicado no puede convertirse ahora en conjunto de tuning.</li>
                <li>Una versión mejorada necesita nueva evidencia temporal todavía intacta.</li>
              </ul>
            </aside>
          </div>
        </section>

        <section className="case-evidence" aria-labelledby="retail-evidence-title">
          <div>
            <p className="eyebrow light">EVIDENCIA PÚBLICA</p>
            <h2 id="retail-evidence-title">Revisar el no-go completo.</h2>
            <p>
              El repositorio conserva los contratos, informes, figuras, pruebas y
              artefactos necesarios para seguir la decisión desde los datos hasta
              las alertas finales.
            </p>
            <div className="case-evidence-links">
              <a className="button button-light" href="https://github.com/xSkyLiN3/retail-demand-forecasting/releases/tag/v1.0.0" target="_blank" rel="noreferrer">Release v1.0.0 <span aria-hidden="true">↗</span></a>
              <a href="https://github.com/xSkyLiN3/retail-demand-forecasting" target="_blank" rel="noreferrer">Repositorio <span aria-hidden="true">↗</span></a>
              <a href="https://github.com/xSkyLiN3/retail-demand-forecasting/blob/v1.0.0/MODEL_CARD.md" target="_blank" rel="noreferrer">Model Card <span aria-hidden="true">↗</span></a>
              <a href="https://github.com/xSkyLiN3/retail-demand-forecasting/blob/v1.0.0/reports/m2/M2_REPORT.md" target="_blank" rel="noreferrer">Informe M2 <span aria-hidden="true">↗</span></a>
              <a href="https://github.com/xSkyLiN3/retail-demand-forecasting/blob/v1.0.0/docs/ARCHITECTURE.md" target="_blank" rel="noreferrer">Arquitectura <span aria-hidden="true">↗</span></a>
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
