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
  assert.match(html, /holdout final reservado de 2\.000 filas/);
  assert.match(html, /no es una probabilidad calibrada/);
  assert.match(html, /no una validación para maquinaria real ni uso industrial/);
  assert.match(html, /https:\/\/ml\.nightstrike\.cloud/);
  assert.match(html, /https:\/\/github\.com\/xSkyLiN3\/predictive-maintenance-ml/);
  assert.match(html, /\/proyectos\/machine-failure-risk-classifier/);
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
    html.indexOf("Machine Failure Risk Classifier") < html.indexOf("Operación Control"),
    "the public ML project should appear before private work",
  );
  assert.ok(
    html.indexOf("Operación Control") < html.indexOf("Weapon Inspector"),
    "the current private pilot should appear before the historical project",
  );
});

test("renders the machine failure risk case study", async () => {
  const response = await render("/proyectos/machine-failure-risk-classifier");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Clasificar riesgo de falla sin ocultar la incertidumbre\./);
  assert.match(html, /CASO DE ESTUDIO/);
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
  assert.match(html, /reports\/modeling\/b15bab7b54bc2e1f\/M3_REPORT\.md/);
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/nightstrike\.cloud\/proyectos\/machine-failure-risk-classifier\/"/,
  );
  assert.match(html, /<meta property="og:title" content="Caso de estudio — Machine Failure Risk Classifier"/);
  assert.doesNotMatch(html, /<meta property="og:image"/);
  assert.doesNotMatch(html, /<meta name="twitter:image"/);
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

  await Promise.all([
    access(pdfUrl),
    access(portraitUrl),
    access(ogUrl),
    access(faviconUrl),
    access(robotsUrl),
    access(sitemapUrl),
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
  const packageMetadata = JSON.parse(await readFile(packageUrl, "utf8"));

  assert.equal(version.site, "cristobal-vergara-portfolio");
  assert.equal(version.version, packageMetadata.version);
  assert.match(version.commit, /^[0-9a-f]{40}$/i);
  assert.match(caseStudy, /Clasificar riesgo de falla sin ocultar la incertidumbre\./);
  assert.doesNotMatch(caseStudy, /<script\b/i);
});
