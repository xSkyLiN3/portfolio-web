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
  assert.match(html, /Construyo software mientras desarrollo mi camino hacia AI\/ML Engineering\./);
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
});

test("ships the public portfolio assets", async () => {
  const pdfUrl = new URL("../public/CV_Cristobal_Vergara.pdf", import.meta.url);
  const portraitUrl = new URL("../public/cristobal-vergara.png", import.meta.url);
  const ogUrl = new URL("../public/og.png", import.meta.url);
  const faviconUrl = new URL("../public/favicon.png", import.meta.url);

  await Promise.all([access(pdfUrl), access(portraitUrl), access(ogUrl), access(faviconUrl)]);
  const pdf = await readFile(pdfUrl);
  assert.equal(pdf.subarray(0, 5).toString("ascii"), "%PDF-");
  assert.ok(pdf.length > 50_000);
});
