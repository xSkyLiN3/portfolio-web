import assert from "node:assert/strict";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.resolve(projectRoot, "deploy");

assert.equal(path.dirname(outputRoot), projectRoot);
assert.equal(path.basename(outputRoot), "deploy");

const workerPath = path.join(projectRoot, "dist", "server", "index.js");
const workerUrl = pathToFileURL(workerPath);
workerUrl.searchParams.set("export", `${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

const response = await worker.fetch(
  new Request("https://nightstrike.cloud/", {
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

assert.equal(response.status, 200);
assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

let html = await response.text();
html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
html = html.replace(/<link\b[^>]*rel=["']modulepreload["'][^>]*>/gi, "");

assert.match(html, /Cristóbal Vergara/);
assert.match(html, /Operación Control/);
assert.doesNotMatch(html, /<script\b/i);

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

await cp(path.join(projectRoot, "public"), outputRoot, { recursive: true });
await cp(
  path.join(projectRoot, "dist", "client", "_next"),
  path.join(outputRoot, "_next"),
  { recursive: true },
);

await writeFile(path.join(outputRoot, "index.html"), html, "utf8");
await writeFile(
  path.join(outputRoot, "site-version.json"),
  `${JSON.stringify({ site: "cristobal-vergara-portfolio", version: "1.0.0" })}\n`,
  "utf8",
);

const exported = await readFile(path.join(outputRoot, "index.html"), "utf8");
assert.match(exported, /CV_Cristobal_Vergara\.pdf/);

console.log(outputRoot);
