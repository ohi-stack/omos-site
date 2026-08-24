const http = require("http");
const https = require("https");
const assert = require("assert");

const BASE_URL = process.env.OMOS_BASE_URL || "http://localhost:3000";

function request(path) {
  const url = new URL(path, BASE_URL);
  const client = url.protocol === "https:" ? https : http;
  return new Promise((resolve, reject) => {
    client.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => resolve({ statusCode: res.statusCode, body: data, headers: res.headers }));
    }).on("error", reject);
  });
}

async function expectOk(path) {
  const response = await request(path);
  assert.ok([200, 301, 302].includes(response.statusCode), `${path} returned ${response.statusCode}`);
  return response;
}

async function expectJson(path) {
  const response = await expectOk(path);
  assert.doesNotThrow(() => JSON.parse(response.body), `${path} did not return valid JSON`);
  return JSON.parse(response.body);
}

async function expectShell(path) {
  const response = await expectOk(path);
  assert.ok(response.body.includes("omos-site-header"), `${path} missing shared header`);
  assert.ok(response.body.includes("omos-site-footer"), `${path} missing shared footer`);
  assert.ok(response.body.includes("omos-ui.css"), `${path} missing global UI stylesheet`);
  assert.ok(response.body.includes("omos-ui.js"), `${path} missing global UI script`);
  return response;
}

async function run() {
  const publicRoutes = [
    "/", "/omos", "/ohi", "/models", "/tools", "/artifacts", "/docs", "/shop",
    "/latest-news", "/dashboard", "/legal", "/contact", "/protocol", "/algorithm",
    "/digital-sanctuary", "/ohi-output-pipeline", "/oru/"
  ];

  for (const route of publicRoutes) await expectShell(route);

  const apiRoutes = ["/api/health", "/api/manifest", "/api/v1/providers", "/api/oru.json"];
  for (const route of apiRoutes) await expectJson(route);

  const manifest = await expectJson("/api/manifest");
  assert.equal(manifest.ui?.sharedHeader, true, "manifest must advertise shared header");
  assert.equal(manifest.ui?.sharedFooter, true, "manifest must advertise shared footer");
  assert.equal(manifest.ui?.megaMenu, true, "manifest must advertise mega menu");

  const oru = await expectJson("/api/oru.json");
  assert.equal(oru.id, "oruvalen", "Oru public profile must use canonical id");
  assert.equal(oru.runtime, "OMOS", "Oru public profile must identify OMOS as runtime");
  assert.equal(oru.controlPlane, "ACC", "Oru public profile must identify ACC as control plane");
  assert.equal(oru.boundaries?.mayOverrideHumanAuthority, false, "Oru must not override human authority");

  await expectOk("/omos-ui.css");
  await expectOk("/omos-ui.js");

  console.log("OMOS global UI shell, OruValen page, and public route tests passed.");
}

run().catch((error) => {
  console.error("Page test failure:", error);
  process.exit(1);
});
