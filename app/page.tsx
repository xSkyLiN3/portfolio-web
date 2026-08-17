import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Desarrollo de software y camino hacia AI/ML",
  description:
    "Portafolio de Cristóbal Vergara, estudiante de Ingeniería en Informática con proyectos propios en Python, TypeScript, PostgreSQL e inteligencia artificial aplicada.",
};

const projects = [
  {
    eyebrow: "SISTEMA APLICADO",
    title: "Operación Control",
    status: "Piloto privado",
    statusTone: "private",
    description:
      "Sistema de gestión operativa desarrollado con Python, Flask y PostgreSQL. El piloto me ha permitido trabajar con permisos por rol, auditoría, exportaciones, despliegue y recuperación operativa.",
    note:
      "Los datos y el acceso permanecen privados. El caso público se preparará únicamente después de anonimizar toda la información.",
    stack: ["Python", "Flask", "PostgreSQL", "Docker", "Linux", "Nginx"],
  },
  {
    eyebrow: "PRODUCTO EN DESARROLLO",
    title: "PortfolioControl",
    status: "Sin demo pública todavía",
    statusTone: "development",
    description:
      "Aplicación web y móvil para organizar y analizar información de inversiones. Integra una base PostgreSQL, control de acceso e IA aplicada mediante OpenAI API.",
    note:
      "Ahora estoy estabilizando el producto y separando los datos reales de una futura experiencia de demostración segura.",
    stack: ["TypeScript", "Next.js", "Expo", "PostgreSQL", "Supabase", "OpenAI API"],
  },
  {
    eyebrow: "PROYECTO PÚBLICO HISTÓRICO",
    title: "Weapon Inspector",
    status: "Código y release públicos",
    statusTone: "public",
    description:
      "Plugin de AMX Mod X para Counter-Strike 1.6. Analiza secuencias de modelos y reproduce animaciones de inspección mediante configuración, caché y una API para otros plugins.",
    note:
      "La versión 1.1.1 tiene compilación reproducible y correcciones verificadas; aún recomiendo una prueba final dentro de un servidor real.",
    stack: ["Pawn", "AMX Mod X", "CI", "GitHub Actions"],
    links: [
      {
        label: "Ver repositorio",
        href: "https://github.com/xSkyLiN3/weapon-inspector-amx",
      },
      {
        label: "Release v1.1.1",
        href: "https://github.com/xSkyLiN3/weapon-inspector-amx/releases/tag/v1.1.1",
      },
    ],
  },
] as const;

const skillGroups = [
  {
    label: "USO PRÁCTICO",
    title: "Lenguajes y datos",
    items: ["Python", "TypeScript", "SQL", "PostgreSQL", "Flask", "Next.js"],
  },
  {
    label: "DESPLIEGUE",
    title: "Infraestructura",
    items: ["Docker", "Linux", "Nginx", "VPS", "respaldos y rollback"],
  },
  {
    label: "IA APLICADA",
    title: "Integración mediante API",
    items: ["OpenAI API", "salidas estructuradas", "validación", "caché"],
  },
  {
    label: "DIRECCIÓN ACTUAL",
    title: "En aprendizaje",
    items: ["Estadística", "ciencia de datos", "machine learning", "evaluación con métricas"],
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
            <h1>Construyo software mientras desarrollo mi camino hacia AI/ML Engineering.</h1>
            <p className="lede">
              Estudiante de 4.º semestre con experiencia práctica en proyectos
              propios usando Python, TypeScript y PostgreSQL. Me interesa
              convertir datos e inteligencia artificial en soluciones útiles,
              confiables y bien construidas.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#proyectos">Ver proyectos</a>
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
                src="/cristobal-vergara.png"
                alt="Retrato profesional de Cristóbal Vergara"
                width={1122}
                height={1402}
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
          <div><strong>Proyectos propios</strong><span>software aplicado y despliegue</span></div>
          <div><strong>AI/ML</strong><span>dirección y aprendizaje activo</span></div>
        </section>

        <section className="about section-shell" aria-labelledby="about-title">
          <div>
            <p className="eyebrow">ACERCA DE</p>
            <h2 id="about-title">Aprendo construyendo sistemas reales.</h2>
          </div>
          <div className="about-copy">
            <p>
              Soy estudiante de Ingeniería en Informática en la Universidad
              Bernardo O&apos;Higgins. He desarrollado aplicaciones propias que me
              han permitido trabajar con backend, frontend, bases de datos,
              autenticación, permisos, despliegue en VPS e integración de IA
              mediante API.
            </p>
            <p>
              Actualmente estoy reforzando Python, estadística, ciencia de datos
              y machine learning para avanzar de forma responsable hacia AI/ML
              Engineering. Prefiero mostrar cada proyecto con su estado real y
              evidencia comprobable.
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
                Sin demos de escaparate que llevan a un login. Cada proyecto
                explica qué existe hoy, qué aprendí y qué falta antes de abrirlo.
              </p>
            </div>

            <div className="projects-grid">
              {projects.map((project, index) => (
                <article
                  className={`project-card ${index === 2 ? "project-card-wide" : ""}`}
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
                        <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
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
              Mi objetivo no es usar AI/ML como etiqueta, sino construir la base
              matemática y de software necesaria para trabajar bien con modelos y datos.
            </p>
          </div>

          <ol className="journey-list">
            <li>
              <span className="journey-index">01</span>
              <div><h3>Fundamentos de software</h3><p>Programación, bases de datos y proyectos propios como campo de aprendizaje.</p></div>
            </li>
            <li>
              <span className="journey-index">02</span>
              <div><h3>Sistemas aplicados</h3><p>Aplicaciones web, control de acceso, despliegue e integración de IA mediante API.</p></div>
            </li>
            <li>
              <span className="journey-index">03</span>
              <div><h3>Datos y machine learning</h3><p>Estadística, ciencia de datos, baselines, validación y métricas como siguiente etapa.</p></div>
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
              <a href="https://www.linkedin.com/in/cristobal-vergarav/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
              <a href="https://github.com/xSkyLiN3" target="_blank" rel="noreferrer">GitHub ↗</a>
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
