import type { Metadata } from "next";
import Link from "next/link";

const caseStudyPath = "/proyectos/machine-failure-risk-classifier";

export const metadata: Metadata = {
  title: "Caso de estudio — Machine Failure Risk Classifier",
  description:
    "Caso de estudio de un sistema educativo de machine learning con evaluación sin leakage, holdout reservado, FastAPI, Docker y límites explícitos.",
  alternates: {
    canonical: `${caseStudyPath}/`,
  },
  openGraph: {
    type: "article",
    url: `${caseStudyPath}/`,
    title: "Caso de estudio — Machine Failure Risk Classifier",
    description:
      "Del contrato de datos a una demo pública: decisiones, evaluación, resultados y limitaciones de un clasificador educativo reproducible.",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Caso de estudio — Machine Failure Risk Classifier",
    description:
      "Decisiones, evaluación, resultados y límites de un clasificador educativo reproducible.",
    images: [],
  },
};

const selectionResults = [
  ["Dummy prior", "0,033875", "0,500000"],
  ["Regresión logística", "0,441433", "0,899275"],
  ["Random forest", "0,643812", "0,969935"],
] as const;

const finalResults = [
  ["Average Precision", "0,649538", "Métrica principal"],
  ["ROC-AUC", "0,965458", "Métrica complementaria"],
  ["Precision", "0,588235", "50 aciertos entre 85 alertas"],
  ["Recall", "0,735294", "50 de 68 fallos detectados"],
  ["F1", "0,653595", "Con el umbral congelado"],
] as const;

export default function MachineFailureRiskCaseStudy() {
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
            <p className="eyebrow">CASO DE ESTUDIO · RELEASE EDUCATIVO 1.0.0</p>
            <h1>Clasificar riesgo de falla sin ocultar la incertidumbre.</h1>
            <p className="case-lede">
              Machine Failure Risk Classifier es un proyecto individual de machine
              learning de principio a fin. El objetivo no fue conseguir una cifra
              llamativa, sino construir un proceso revisable: datos identificados,
              selección sin leakage, evaluación final única, API estricta y una demo
              que también sabe abstenerse.
            </p>
            <div className="hero-actions">
              <a
                className="button primary"
                href="https://ml.nightstrike.cloud"
                target="_blank"
                rel="noreferrer"
              >
                Probar demo <span aria-hidden="true">↗</span>
              </a>
              <a
                className="button secondary"
                href="https://github.com/xSkyLiN3/predictive-maintenance-ml"
                target="_blank"
                rel="noreferrer"
              >
                Ver código <span aria-hidden="true">↗</span>
              </a>
              <a
                className="text-link"
                href="https://github.com/xSkyLiN3/predictive-maintenance-ml/blob/main/docs/MODEL_CARD.md"
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
              <div>
                <dt>Rol</dt>
                <dd>Proyecto individual</dd>
              </div>
              <div>
                <dt>Alcance</dt>
                <dd>Datos · modelo · API · despliegue</dd>
              </div>
              <div>
                <dt>Dataset</dt>
                <dd>UCI AI4I 2020 · sintético</dd>
              </div>
              <div>
                <dt>Stack</dt>
                <dd>Python · scikit-learn · FastAPI · Docker</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd><span className="status status-public">Demo pública disponible</span></dd>
              </div>
            </dl>
          </aside>
        </section>

        <section className="case-metrics" aria-label="Resultados principales">
          <div>
            <strong>0,650</strong>
            <span>Average Precision en holdout</span>
          </div>
          <div>
            <strong>0,735</strong>
            <span>Recall · 50 de 68 fallos</span>
          </div>
          <div>
            <strong>2.000</strong>
            <span>observaciones en el holdout final</span>
          </div>
          <div>
            <strong>3</strong>
            <span>candidatos comparados con los mismos folds</span>
          </div>
        </section>

        <section className="case-section section-shell" id="reto" aria-labelledby="challenge-title">
          <div className="case-section-heading">
            <p className="eyebrow">01 · RETO</p>
            <h2 id="challenge-title">Un problema pequeño con una evaluación exigente.</h2>
          </div>
          <div className="case-content">
            <p className="case-intro">
              El dataset AI4I 2020 contiene 10.000 observaciones sintéticas y una
              clase positiva poco frecuente. La tarea es clasificar una observación
              como fallo o no fallo usando seis variables operativas.
            </p>
            <p>
              El principal riesgo era construir una demo convincente con evidencia
              débil: usar columnas que revelan el target, seleccionar el umbral con
              el conjunto final o destacar una accuracy alta cuando la clase
              mayoritaria ya alcanza 96,6 %. Por eso el trabajo se centró primero en
              el contrato de evaluación y después en el modelo.
            </p>
            <div className="case-fact">
              <span>ALCANCE HONESTO</span>
              <p>
                Es una demostración educativa de ingeniería de machine learning. No
                predice vida útil restante, causas físicas ni fallos futuros de una
                máquina real.
              </p>
            </div>
          </div>
        </section>

        <section className="case-section section-shell" id="proceso" aria-labelledby="process-title">
          <div className="case-section-heading">
            <p className="eyebrow">02 · PROCESO</p>
            <h2 id="process-title">Separar selección, evaluación e inferencia.</h2>
          </div>
          <div className="case-content">
            <p className="case-intro">
              El holdout se materializó antes de la exploración. A partir de ahí,
              las decisiones de features, modelo y umbral se hicieron solo con las
              8.000 filas de training.
            </p>
            <ol className="case-flow" aria-label="Flujo de datos y evaluación">
              <li>
                <span>01</span>
                <h3>Snapshot verificado</h3>
                <p>Fuente, schema y SHA-256 fijados antes de transformar los datos.</p>
              </li>
              <li>
                <span>02</span>
                <h3>Split 80/20</h3>
                <p>Partición estratificada con el holdout separado antes de la EDA.</p>
              </li>
              <li>
                <span>03</span>
                <h3>Selección en training</h3>
                <p>Cinco folds, tres baselines y un Pipeline que contiene el preprocesamiento.</p>
              </li>
              <li>
                <span>04</span>
                <h3>Umbral OOF</h3>
                <p>Umbral elegido con predicciones out-of-fold y congelado antes del resultado final.</p>
              </li>
              <li>
                <span>05</span>
                <h3>Evaluación final registrada</h3>
                <p>El workflow ejecutó una evaluación final; el recibo versionado conserva el resultado.</p>
              </li>
              <li>
                <span>06</span>
                <h3>API verificable</h3>
                <p>El artefacto congelado se valida al cargar y se abstiene fuera de su referencia.</p>
              </li>
            </ol>

            <div className="case-grid case-grid-decisions">
              <article className="case-panel">
                <p className="card-eyebrow">FEATURES</p>
                <h3>Lista permitida, no un drop incompleto</h3>
                <p>
                  Se excluyeron identificadores y los cinco indicadores de modos de
                  fallo porque introducirían señales no generalizables o leakage.
                </p>
              </article>
              <article className="case-panel">
                <p className="card-eyebrow">MÉTRICA</p>
                <h3>Average Precision antes que accuracy</h3>
                <p>
                  La clase positiva es minoritaria. AP permite comparar la calidad
                  del ranking sin esconder el problema detrás de la clase dominante.
                </p>
              </article>
              <article className="case-panel">
                <p className="card-eyebrow">MODELO</p>
                <h3>Comparación acotada</h3>
                <p>
                  Dummy, regresión logística y random forest. No hubo una búsqueda
                  extensa de hiperparámetros después de mirar el resultado.
                </p>
              </article>
              <article className="case-panel">
                <p className="card-eyebrow">APLICABILIDAD</p>
                <h3>Abstenerse también es una respuesta</h3>
                <p>
                  Si un valor sale de la envolvente marginal observada en training,
                  la API responde sin score ni clasificación.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="case-section section-shell" id="resultados" aria-labelledby="results-title">
          <div className="case-section-heading">
            <p className="eyebrow">03 · RESULTADOS</p>
            <h2 id="results-title">Un resultado útil solo cuando conserva su contexto.</h2>
          </div>
          <div className="case-content">
            <div className="case-table-wrap">
              <table className="case-table">
                <caption>Selección mediante validación cruzada sobre training</caption>
                <thead>
                  <tr>
                    <th scope="col">Candidato</th>
                    <th scope="col">AP media CV</th>
                    <th scope="col">ROC-AUC media</th>
                  </tr>
                </thead>
                <tbody>
                  {selectionResults.map(([model, ap, rocAuc]) => (
                    <tr key={model}>
                      <th scope="row">{model}</th>
                      <td>{ap}</td>
                      <td>{rocAuc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="case-table-wrap">
              <table className="case-table">
                <caption>Evaluación final sobre 2.000 observaciones</caption>
                <thead>
                  <tr>
                    <th scope="col">Métrica</th>
                    <th scope="col">Resultado</th>
                    <th scope="col">Lectura</th>
                  </tr>
                </thead>
                <tbody>
                  {finalResults.map(([metric, value, meaning]) => (
                    <tr key={metric}>
                      <th scope="row">{metric}</th>
                      <td>{value}</td>
                      <td>{meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="case-result-callout">
              <p className="card-eyebrow">LECTURA PRÁCTICA DEL HOLDOUT</p>
              <strong>50 fallos detectados · 18 omitidos · 35 falsas alertas</strong>
              <p>
                La precision estimada tiene un intervalo Wilson del 95 % de
                0,482–0,687 y el recall de 0,620–0,826. Los intervalos reflejan el
                soporte finito de este holdout; no corrigen el carácter sintético de
                los datos ni miden incertidumbre por observación.
              </p>
            </div>
          </div>
        </section>

        <section className="case-section section-shell" aria-labelledby="engineering-title">
          <div className="case-section-heading">
            <p className="eyebrow">04 · INGENIERÍA</p>
            <h2 id="engineering-title">El modelo es solo una pieza del sistema.</h2>
          </div>
          <div className="case-content">
            <div className="case-grid">
              <article className="case-panel">
                <p className="card-eyebrow">TRAZABILIDAD</p>
                <h3>Artefactos con identidad</h3>
                <p>Manifiestos, hashes, run congelado y recibo final conectan datos, selección, modelo y evaluación.</p>
              </article>
              <article className="case-panel">
                <p className="card-eyebrow">CONTRATO API</p>
                <h3>Entradas estrictas</h3>
                <p>FastAPI rechaza campos extra, tipos ambiguos, valores no finitos, claves duplicadas y cuerpos sobredimensionados.</p>
              </article>
              <article className="case-panel">
                <p className="card-eyebrow">RUNTIME</p>
                <h3>Carga fail-closed</h3>
                <p>La aplicación comprueba identidad, hash, versiones, clases y orden de features antes de servir una predicción.</p>
              </article>
              <article className="case-panel">
                <p className="card-eyebrow">ENTREGA</p>
                <h3>Pruebas y contenedor</h3>
                <p>La release pasa 227 pruebas, CI en Windows/Linux y se ejecuta en un contenedor mínimo con usuario no root.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="case-section section-shell" id="limites" aria-labelledby="limits-title">
          <div className="case-section-heading">
            <p className="eyebrow">05 · LÍMITES</p>
            <h2 id="limits-title">Lo que este proyecto no demuestra.</h2>
          </div>
          <div className="case-content">
            <aside className="case-warning" aria-label="Limitaciones del proyecto">
              <h3>No está validado para maquinaria real ni decisiones de seguridad.</h3>
              <ul>
                <li>AI4I 2020 es sintético y no representa una población industrial comprobada.</li>
                <li>El split aleatorio estima generalización IID, no generalización temporal, entre máquinas o plantas.</li>
                <li>El risk_score no fue evaluado como una probabilidad calibrada de fallo.</li>
                <li>La envolvente marginal de training no es un detector OOD completo ni un límite físico.</li>
                <li>No se modelaron costos reales, deriva, incertidumbre por predicción ni contexto temporal.</li>
              </ul>
            </aside>

            <div className="case-grid case-grid-followup">
              <article className="case-panel">
                <p className="card-eyebrow">PARA USO REAL</p>
                <h3>La evidencia tendría que cambiar</h3>
                <p>
                  Harían falta datos representativos, validación externa y temporal,
                  costos operativos, calibración, monitoreo de deriva y revisión de
                  ingeniería y seguridad.
                </p>
              </article>
              <article className="case-panel">
                <p className="card-eyebrow">APRENDIZAJE</p>
                <h3>La evaluación también es producto</h3>
                <p>
                  La parte más importante no fue entrenar un random forest, sino
                  establecer contratos que hicieran revisables los datos, la
                  selección, el artefacto y cada respuesta de la API.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="case-evidence" aria-labelledby="evidence-title">
          <div>
            <p className="eyebrow light">EVIDENCIA PÚBLICA</p>
            <h2 id="evidence-title">Revisar el sistema, no solo el resumen.</h2>
            <p>
              La demo permite probar el contrato de inferencia. El repositorio
              conserva metodología, pruebas, decisiones y resultados versionados.
            </p>
            <div className="case-evidence-links">
              <a className="button button-light" href="https://ml.nightstrike.cloud" target="_blank" rel="noreferrer">
                Probar demo <span aria-hidden="true">↗</span>
              </a>
              <a href="https://github.com/xSkyLiN3/predictive-maintenance-ml" target="_blank" rel="noreferrer">
                Repositorio <span aria-hidden="true">↗</span>
              </a>
              <a href="https://github.com/xSkyLiN3/predictive-maintenance-ml/blob/main/docs/MODEL_CARD.md" target="_blank" rel="noreferrer">
                Model Card <span aria-hidden="true">↗</span>
              </a>
              <a href="https://github.com/xSkyLiN3/predictive-maintenance-ml/blob/main/reports/modeling/b15bab7b54bc2e1f/M3_REPORT.md" target="_blank" rel="noreferrer">
                Informe de evaluación <span aria-hidden="true">↗</span>
              </a>
              <a href="https://github.com/xSkyLiN3/predictive-maintenance-ml/releases/tag/v1.0.0" target="_blank" rel="noreferrer">
                Release v1.0.0 <span aria-hidden="true">↗</span>
              </a>
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
