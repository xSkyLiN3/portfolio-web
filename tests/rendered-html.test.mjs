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
  assert.match(html, /Demo pública verificada/);
  assert.match(html, /average precision 0,650/);
  assert.match(html, /recall 0,735/);
  assert.match(html, /holdout sellado de 2\.000 filas/);
  assert.match(html, /no es una probabilidad calibrada/);
  assert.match(html, /no una validación para maquinaria real ni uso industrial/);
  assert.match(html, /https:\/\/ml\.nightstrike\.cloud/);
  assert.match(html, /https:\/\/github\.com\/xSkyLiN3\/predictive-maintenance-ml/);
  assert.match(html, /Operación Control/);
  assert.match(html, /PortfolioControl/);
  assert.match(html, /Weapon Inspector/);
  assert.match(html, /Piloto privado/);
  assert.match(html, /Sin demo pública todavía/);
  assert.match(html, /CV_Cristobal_Vergara\.pdf/);
  assert.match(html, /https:\/\/nightstrike\.cloud\/og\.png/);
  assert.match(html, /mailto:cvarvergara@gmail\.com/);

  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/);
  assert.doesNotMatch(html, /\b9\d{8}\b/);
  assert.doesNotMatch(html, /\b\d{1,2}\.\d{3}\.\d{3}-[\dkK]\b/);
  assert.ok(
    html.indexOf("Machine Failure Risk Classifier") < html.indexOf("Operación Control"),
    "the public ML project should appear before private work",
  );
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
});

test("exports a versioned static release", async () => {
  const versionUrl = new URL("../deploy/site-version.json", import.meta.url);
  const packageUrl = new URL("../package.json", import.meta.url);
  const version = JSON.parse(await readFile(versionUrl, "utf8"));
  const packageMetadata = JSON.parse(await readFile(packageUrl, "utf8"));

  assert.equal(version.site, "cristobal-vergara-portfolio");
  assert.equal(version.version, packageMetadata.version);
  assert.match(version.commit, /^[0-9a-f]{40}$/i);
});
