import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Software, datos y camino hacia AI/ML",
  description:
    "Portafolio de Cristóbal Vergara, estudiante de Ingeniería en Informática con una demo pública de machine learning y proyectos propios de software.",
};

const projects = [
  {
    eyebrow: "PROYECTO PRINCIPAL · MACHINE LEARNING",
    title: "Machine Failure Risk Classifier",
    status: "Demo pública disponible",
    statusTone: "public",
    featured: true,
    wide: true,
    description:
      "Sistema educativo de machine learning que clasifica casos según riesgo de falla a partir del dataset sintético AI4I. Incluye entrenamiento reproducible, prevención explícita de leakage, holdout reservado, API FastAPI y despliegue reproducible con Docker.",
    note:
      "Resultado final: average precision 0,650 y recall 0,735 sobre un holdout final reservado de 2.000 filas. La puntuación no es una probabilidad calibrada; es evidencia técnica reproducible, no una validación para maquinaria real ni uso industrial.",
    stack: ["Python", "scikit-learn", "FastAPI", "Docker", "pytest", "GitHub Actions"],
    links: [
      {
        label: "Probar demo",
        href: "https://ml.nightstrike.cloud",
        external: true,
      },
      {
        label: "Leer caso de estudio",
        href: "/proyectos/machine-failure-risk-classifier/",
        external: false,
      },
      {
        label: "Ver repositorio",
        href: "https://github.com/xSkyLiN3/predictive-maintenance-ml",
        external: true,
      },
      {
        label: "Leer Model Card",
        href: "https://github.com/xSkyLiN3/predictive-maintenance-ml/blob/main/docs/MODEL_CARD.md",
        external: true,
      },
    ],
  },
  {
    eyebrow: "SISTEMA APLICADO",
    title: "Operación Control",
    status: "Piloto privado",
    statusTone: "private",
    featured: false,
    wide: false,
    description:
      "Piloto privado de gestión operativa desarrollado con Python, Flask y PostgreSQL. En este proyecto trabajo con permisos por rol, auditoría, exportaciones y despliegue en VPS.",
    note:
      "Por confidencialidad, no hay demo ni datos públicos. Prepararé un caso anonimizado solo cuando pueda mostrar evidencia sin exponer información operativa.",
    stack: ["Python", "Flask", "PostgreSQL", "Docker", "Linux", "Nginx"],
  },
  {
    eyebrow: "PROYECTO PÚBLICO HISTÓRICO",
    title: "Weapon Inspector",
    status: "Código y release públicos",
    statusTone: "public",
    featured: false,
    wide: false,
    description:
      "Plugin de AMX Mod X para Counter-Strike 1.6. Analiza secuencias de modelos y reproduce animaciones de inspección mediante configuración, caché y una API para otros plugins.",
    note:
      "Proyecto histórico que muestra trabajo con un ecosistema legado, configuración y CI. La release es pública; aún requiere una validación final dentro de un servidor real.",
    stack: ["Pawn", "AMX Mod X", "CI", "GitHub Actions"],
    links: [
      {
        label: "Ver repositorio",
        href: "https://github.com/xSkyLiN3/weapon-inspector-amx",
        external: true,
      },
      {
        label: "Release v1.1.1",
        href: "https://github.com/xSkyLiN3/weapon-inspector-amx/releases/tag/v1.1.1",
        external: true,
      },
    ],
  },
] as const;

const skillGroups = [
  {
    label: "DESARROLLO",
    title: "Lenguajes, web y datos",
    items: ["Python", "TypeScript", "SQL", "PostgreSQL", "FastAPI", "Flask", "Next.js"],
  },
  {
    label: "CALIDAD Y DESPLIEGUE",
    title: "Entrega reproducible",
    items: ["pytest", "GitHub Actions", "Docker", "Linux", "Nginx"],
  },
  {
    label: "MACHINE LEARNING",
    title: "Práctica con evidencia",
    items: ["scikit-learn", "pandas", "validación", "métricas", "prevención de leakage"],
  },
  {
    label: "DIRECCIÓN ACTUAL",
    title: "Base en expansión",
    items: ["Estadística", "ciencia de datos", "ML engineering", "evaluación responsable"],
  },
] as const;

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>

      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#inicio" aria-label="Ir al inicio">
            <span className="brand-mark" aria-hidden="true">CV</span>
            <span>Cristóbal Vergara</span>
          </a>
          <nav className="main-nav" aria-label="Navegación principal">
            <a href="#proyectos">Proyectos</a>
            <a href="#trayectoria">Trayectoria</a>
            <a href="#formacion">Formación</a>
            <a href="#contacto">Contacto</a>
          </nav>
          <a className="header-cta" href="/CV_Cristobal_Vergara.pdf" download>
            Descargar CV
          </a>
        </div>
      </header>

      <main id="contenido">
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <p className="eyebrow">CRISTÓBAL VERGARA · INGENIERÍA EN INFORMÁTICA</p>
            <h1>Construyo software reproducible y avanzo hacia AI/ML Engineering.</h1>
            <p className="lede">
              Estudiante de 4.º semestre con proyectos propios en Python,
              TypeScript y PostgreSQL. Mi trabajo principal es una demo pública
              de machine learning con modelo, API, pruebas, contenedor y métricas
              verificables.
            </p>
            <div className="hero-actions">
              <a
                className="button primary"
                href="https://ml.nightstrike.cloud"
                target="_blank"
                rel="noreferrer"
              >
                Probar demo ML <span aria-hidden="true">↗</span>
              </a>
              <a className="button secondary" href="#proyectos">Ver proyectos</a>
              <a className="button secondary" href="/CV_Cristobal_Vergara.pdf" download>
                Descargar CV
              </a>
              <a
                className="text-link"
                href="https://github.com/xSkyLiN3"
                target="_blank"
                rel="noreferrer"
              >
                GitHub <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <div className="portrait-wrap">
            <div className="portrait-grid" aria-hidden="true" />
            <div className="portrait-frame">
              <Image
                src="/cristobal-vergara.webp"
                alt="Retrato profesional de Cristóbal Vergara"
                width={900}
                height={1125}
                priority
                unoptimized
              />
            </div>
            <p className="portrait-caption">
              <span className="availability-dot" aria-hidden="true" />
              Santiago, Chile · Abierto a oportunidades iniciales
            </p>
          </div>
        </section>

        <section className="context-strip" aria-label="Resumen profesional">
          <div><strong>4.º semestre</strong><span>de 8 en Ingeniería Informática</span></div>
          <div><strong>Python · TypeScript</strong><span>PostgreSQL · SQL</span></div>
          <div><strong>Demo ML pública</strong><span>modelo · API · Docker · CI</span></div>
          <div><strong>AI/ML Engineering</strong><span>dirección profesional en desarrollo</span></div>
        </section>

        <section className="about section-shell" aria-labelledby="about-title">
          <div>
            <p className="eyebrow">ACERCA DE</p>
            <h2 id="about-title">Aprendo construyendo proyectos completos y documentando sus límites.</h2>
          </div>
          <div className="about-copy">
            <p>
              Soy estudiante de Ingeniería en Informática en la Universidad
              Bernardo O&apos;Higgins. Aprendo construyendo proyectos propios que
              abarcan backend, frontend, bases de datos, autenticación,
              despliegue en VPS y, más recientemente, un sistema de machine
              learning reproducible de extremo a extremo.
            </p>
            <p>
              Mi objetivo es avanzar hacia AI/ML Engineering con una base sólida
              de software, datos y evaluación. Por eso publico métricas,
              limitaciones y decisiones técnicas, y distingo con claridad entre
              una demo educativa, un piloto privado y un producto aún en desarrollo.
            </p>
          </div>
        </section>

        <section className="projects-section" id="proyectos" aria-labelledby="projects-title">
          <div className="section-shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">TRABAJO SELECCIONADO</p>
                <h2 id="projects-title">Proyectos con contexto y estado real.</h2>
              </div>
              <p>
                La demo principal puede probarse sin registro. Los demás proyectos
                explican qué existe hoy, qué aprendí y por qué algunos accesos
                permanecen privados.
              </p>
            </div>

            <div className="projects-grid">
              {projects.map((project, index) => (
                <article
                  className={[
                    "project-card",
                    project.featured ? "project-card-featured" : "",
                    project.wide ? "project-card-wide" : "",
                  ].filter(Boolean).join(" ")}
                  key={project.title}
                >
                  <div className="project-topline">
                    <span className="project-number">0{index + 1}</span>
                    <span className={`status status-${project.statusTone}`}>{project.status}</span>
                  </div>
                  <p className="card-eyebrow">{project.eyebrow}</p>
                  <h3>{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <p className="project-note">{project.note}</p>
                  <ul className="tag-list" aria-label={`Tecnologías de ${project.title}`}>
                    {project.stack.map((technology) => <li key={technology}>{technology}</li>)}
                  </ul>
                  {"links" in project && (
                    <div className="project-links">
                      {project.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target={link.external ? "_blank" : undefined}
                          rel={link.external ? "noreferrer" : undefined}
                        >
                          {link.label} <span aria-hidden="true">↗</span>
                        </a>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="journey section-shell" id="trayectoria" aria-labelledby="journey-title">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">TRAYECTORIA</p>
              <h2 id="journey-title">Una dirección clara, sin atajos.</h2>
            </div>
            <p>
              Mi objetivo no es usar AI/ML como etiqueta, sino demostrar una base
              creciente de software, datos, evaluación y despliegue responsable.
            </p>
          </div>

          <ol className="journey-list">
            <li>
              <span className="journey-index">01</span>
              <div><h3>Fundamentos de software</h3><p>Programación, bases de datos y proyectos propios como campo de aprendizaje.</p></div>
            </li>
            <li>
              <span className="journey-index">02</span>
              <div><h3>Sistemas aplicados</h3><p>Aplicaciones web, control de acceso, bases de datos y despliegue de un piloto privado.</p></div>
            </li>
            <li>
              <span className="journey-index">03</span>
              <div><h3>Datos y machine learning</h3><p>Primer sistema reproducible con baseline, prevención de leakage, holdout reservado, métricas y demo pública.</p></div>
            </li>
          </ol>
        </section>

        <section className="skills-section" aria-labelledby="skills-title">
          <div className="section-shell">
            <div className="skills-intro">
              <p className="eyebrow">TECNOLOGÍAS</p>
              <h2 id="skills-title">Agrupadas por evidencia, no por porcentajes.</h2>
            </div>
            <div className="skills-grid">
              {skillGroups.map((group) => (
                <article className="skill-card" key={group.label}>
                  <p className="card-eyebrow">{group.label}</p>
                  <h3>{group.title}</h3>
                  <p>{group.items.join(" · ")}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="education section-shell" id="formacion" aria-labelledby="education-title">
          <div>
            <p className="eyebrow">FORMACIÓN</p>
            <h2 id="education-title">Base académica y aprendizaje continuo.</h2>
          </div>
          <div className="education-list">
            <article>
              <span className="education-meta">2025—ACTUALIDAD</span>
              <div>
                <h3>Ingeniería en Informática</h3>
                <p>Universidad Bernardo O&apos;Higgins</p>
                <p className="muted">4.º semestre de 8 · egreso estimado en 2028</p>
              </div>
            </article>
            <article>
              <span className="education-meta">MAYO 2026</span>
              <div>
                <h3>Python — Kaggle</h3>
                <p>Credencial verificable de fundamentos de Python.</p>
                <a
                  className="text-link"
                  href="https://www.kaggle.com/learn/certification/cristobalvergara03/python"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver credencial <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          </div>
        </section>

        <section className="contact-section" id="contacto" aria-labelledby="contact-title">
          <div className="contact-card">
            <p className="eyebrow light">CONTACTO</p>
            <h2 id="contact-title">Conversemos sobre una oportunidad para seguir creciendo.</h2>
            <p>
              Estoy construyendo una base sólida en software, datos y machine learning.
              Puedes revisar mi trabajo público o contactarme para conversar sobre
              prácticas y oportunidades iniciales.
            </p>
            <div className="contact-actions">
              <a className="button button-light" href="mailto:cvarvergara@gmail.com">Enviar correo</a>
              <a href="https://www.linkedin.com/in/cristobal-vergarav/" target="_blank" rel="noreferrer">
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
              <a href="https://github.com/xSkyLiN3" target="_blank" rel="noreferrer">
                GitHub <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <span>© 2026 Cristóbal Vergara</span>
          <span>Construido con criterio, evidencia y mejora continua.</span>
        </div>
      </footer>
    </>
  );
}
