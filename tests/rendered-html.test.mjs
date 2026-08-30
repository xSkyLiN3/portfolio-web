import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`https://nightstrike.cloud${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders the complete professional portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Construyo software reproducible y avanzo hacia AI\/ML Engineering\./);
  assert.match(html, /Machine Failure Risk Classifier/);
  assert.match(html, /Demo pública disponible/);
  assert.match(html, /average precision 0,650/);
  assert.match(html, /recall 0,735/);
  assert.match(html, /sobre 2\.000 filas/);
  assert.match(html, /no es una probabilidad calibrada/);
  assert.match(html, /no es una validación industrial/);
  assert.match(html, /https:\/\/ml\.nightstrike\.cloud/);
  assert.match(html, /https:\/\/github\.com\/xSkyLiN3\/predictive-maintenance-ml/);
  assert.match(html, /\/proyectos\/machine-failure-risk-classifier/);
  assert.match(html, /Retail Demand Forecasting &amp; Monitoring/);
  assert.match(html, /77,02 % de cobertura/);
  assert.match(html, /\/proyectos\/retail-demand-forecasting/);
  assert.match(html, /RutaCuadrilla/);
  assert.match(html, /72 puntos y geometrías 100 % sintéticas/);
  assert.match(html, /\/proyectos\/rutacuadrilla/);
  assert.match(html, /Operación Control/);
  assert.match(html, /Weapon Inspector/);
  assert.match(html, /Piloto privado/);
  assert.match(html, /proyectos completos y documentando sus límites/);
  assert.match(html, /CV_Cristobal_Vergara\.pdf/);
  assert.match(html, /https:\/\/nightstrike\.cloud\/og\.png/);
  assert.match(html, /mailto:cvarvergara@gmail\.com/);

  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/);
  assert.doesNotMatch(html, /PortfolioControl|OpenAI API/);
  assert.doesNotMatch(html, /\b9\d{8}\b/);
  assert.doesNotMatch(html, /\b\d{1,2}\.\d{3}\.\d{3}-[\dkK]\b/);
  assert.ok(
    html.indexOf("<h3>Machine Failure Risk Classifier</h3>") <
      html.indexOf("<h3>Retail Demand Forecasting &amp; Monitoring</h3>"),
    "the live ML demo should appear before the forecasting case",
  );
  assert.ok(
    html.indexOf("<h3>Retail Demand Forecasting &amp; Monitoring</h3>") <
      html.indexOf("<h3>RutaCuadrilla</h3>"),
    "the two ML projects should appear before the full-stack case",
  );
  assert.ok(
    html.indexOf("<h3>RutaCuadrilla</h3>") < html.indexOf("<h3>Operación Control</h3>"),
    "all public case studies should appear before private work",
  );
});

test("renders the machine failure risk case study", async () => {
  const response = await render("/proyectos/machine-failure-risk-classifier");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Clasificar riesgo de falla sin ocultar la incertidumbre\./);
  assert.match(html, /CASO DE ESTUDIO/);
  assert.match(html, /RELEASE EDUCATIVO 1\.0\.1/);
  assert.match(html, /Average Precision/);
  assert.match(html, /0,649538/);
  assert.match(html, /0,735294/);
  assert.match(html, /50 fallos detectados/);
  assert.match(html, /18 omitidos/);
  assert.match(html, /35 falsas alertas/);
  assert.match(html, /No está validado para maquinaria real ni decisiones de seguridad\./);
  assert.match(html, /risk_score no fue evaluado como una probabilidad calibrada/);
  assert.match(html, /https:\/\/ml\.nightstrike\.cloud/);
  assert.match(html, /docs\/MODEL_CARD\.md/);
  assert.match(html, /docs\/EVALUATION_REPORT\.md/);
  assert.match(html, /releases\/tag\/v1\.0\.1/);
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/nightstrike\.cloud\/proyectos\/machine-failure-risk-classifier\/"/,
  );
  assert.match(html, /<meta property="og:title" content="Caso de estudio — Machine Failure Risk Classifier"/);
  assert.match(html, /<meta property="og:image" content="https:\/\/nightstrike\.cloud\/projects\/predictive-demo\.png"/);
  assert.match(html, /<meta name="twitter:image" content="https:\/\/nightstrike\.cloud\/projects\/predictive-demo\.png"/);
  assert.doesNotMatch(html, /\b9\d{8}\b/);
  assert.doesNotMatch(html, /\b\d{1,2}\.\d{3}\.\d{3}-[\dkK]\b/);
});

test("renders the retail demand forecasting case study", async () => {
  const response = await render("/proyectos/retail-demand-forecasting");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /Publicar un no-go también es ingeniería\./);
  assert.match(html, /77,02 %/);
  assert.match(html, /85 %/);
  assert.match(html, /52 alertas/);
  assert.match(html, /degraded_with_published_alerts/);
  assert.match(html, /No está aprobado para compras, inventario ni decisiones comerciales\./);
  assert.match(html, /releases\/tag\/v1\.0\.0/);
  assert.match(html, /<link rel="canonical" href="https:\/\/nightstrike\.cloud\/proyectos\/retail-demand-forecasting\/"/);
  assert.match(html, /<meta property="og:image" content="https:\/\/nightstrike\.cloud\/projects\/retail-dashboard\.png"/);
  assert.doesNotMatch(html, /\b9\d{8}\b/);
  assert.doesNotMatch(html, /\b\d{1,2}\.\d{3}\.\d{3}-[\dkK]\b/);
});

test("renders the RutaCuadrilla case study", async () => {
  const response = await render("/proyectos/rutacuadrilla");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /Coordinar trabajo de campo sin perder el estado canónico\./);
  assert.match(html, /72 puntos ficticios/);
  assert.match(html, /segmentos sintéticos/);
  assert.match(html, /Registrar una visita en Campo cambió el contador de Administración/);
  assert.match(html, /no un SaaS certificado para datos sensibles/);
  assert.match(html, /releases\/tag\/v0\.1\.0/);
  assert.match(html, /<link rel="canonical" href="https:\/\/nightstrike\.cloud\/proyectos\/rutacuadrilla\/"/);
  assert.match(html, /<meta property="og:image" content="https:\/\/nightstrike\.cloud\/projects\/rutacuadrilla-admin\.png"/);
  assert.doesNotMatch(html, /\b9\d{8}\b/);
  assert.doesNotMatch(html, /\b\d{1,2}\.\d{3}\.\d{3}-[\dkK]\b/);
});

test("ships the public portfolio assets", async () => {
  const pdfUrl = new URL("../public/CV_Cristobal_Vergara.pdf", import.meta.url);
  const portraitUrl = new URL("../public/cristobal-vergara.webp", import.meta.url);
  const ogUrl = new URL("../public/og.png", import.meta.url);
  const faviconUrl = new URL("../public/favicon.png", import.meta.url);
  const robotsUrl = new URL("../public/robots.txt", import.meta.url);
  const sitemapUrl = new URL("../public/sitemap.xml", import.meta.url);
  const predictiveDemoUrl = new URL("../public/projects/predictive-demo.png", import.meta.url);
  const retailDashboardUrl = new URL("../public/projects/retail-dashboard.png", import.meta.url);
  const retailCoverageUrl = new URL("../public/projects/retail-coverage.svg", import.meta.url);
  const routeAdminUrl = new URL("../public/projects/rutacuadrilla-admin.png", import.meta.url);
  const routeFieldUrl = new URL("../public/projects/rutacuadrilla-field.png", import.meta.url);

  await Promise.all([
    access(pdfUrl),
    access(portraitUrl),
    access(ogUrl),
    access(faviconUrl),
    access(robotsUrl),
    access(sitemapUrl),
    access(predictiveDemoUrl),
    access(retailDashboardUrl),
    access(retailCoverageUrl),
    access(routeAdminUrl),
    access(routeFieldUrl),
  ]);
  const pdf = await readFile(pdfUrl);
  assert.equal(pdf.subarray(0, 5).toString("ascii"), "%PDF-");
  assert.ok(pdf.length > 50_000);

  const robots = await readFile(robotsUrl, "utf8");
  const sitemap = await readFile(sitemapUrl, "utf8");
  assert.match(robots, /Sitemap: https:\/\/nightstrike\.cloud\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/nightstrike\.cloud\/<\/loc>/);
  assert.match(
    sitemap,
    /<loc>https:\/\/nightstrike\.cloud\/proyectos\/machine-failure-risk-classifier\/<\/loc>/,
  );
  assert.match(
    sitemap,
    /<loc>https:\/\/nightstrike\.cloud\/proyectos\/retail-demand-forecasting\/<\/loc>/,
  );
  assert.match(
    sitemap,
    /<loc>https:\/\/nightstrike\.cloud\/proyectos\/rutacuadrilla\/<\/loc>/,
  );
});

test("exports a versioned static release", async () => {
  const versionUrl = new URL("../deploy/site-version.json", import.meta.url);
  const caseStudyUrl = new URL(
    "../deploy/proyectos/machine-failure-risk-classifier/index.html",
    import.meta.url,
  );
  const packageUrl = new URL("../package.json", import.meta.url);
  const version = JSON.parse(await readFile(versionUrl, "utf8"));
  const caseStudy = await readFile(caseStudyUrl, "utf8");
  const retailCaseStudy = await readFile(
    new URL("../deploy/proyectos/retail-demand-forecasting/index.html", import.meta.url),
    "utf8",
  );
  const routeCaseStudy = await readFile(
    new URL("../deploy/proyectos/rutacuadrilla/index.html", import.meta.url),
    "utf8",
  );
  const packageMetadata = JSON.parse(await readFile(packageUrl, "utf8"));

  assert.equal(version.site, "cristobal-vergara-portfolio");
  assert.equal(version.version, packageMetadata.version);
  assert.match(version.commit, /^[0-9a-f]{40}$/i);
  assert.match(caseStudy, /Clasificar riesgo de falla sin ocultar la incertidumbre\./);
  assert.match(retailCaseStudy, /Publicar un no-go también es ingeniería\./);
  assert.match(routeCaseStudy, /Coordinar trabajo de campo sin perder el estado canónico\./);
  assert.doesNotMatch(caseStudy, /<script\b/i);
  assert.doesNotMatch(retailCaseStudy, /<script\b/i);
  assert.doesNotMatch(routeCaseStudy, /<script\b/i);
});
