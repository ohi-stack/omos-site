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
  assert.ok(response.body.includes("omos-mega"), `${path} missing mega menu`);
  return response;
}

async function expectAskWorkspace() {
  const response = await expectOk("/ask/");
  const required = [
    "Ask OMOS — Governed Intelligence Workspace",
    "INPUT",
    "LAYER 1",
    "ALIGN",
    "COUNCIL",
    "SYNTHESIZE",
    "RECORD",
    "HISTORY",
    "Pending",
    "Running",
    "Complete",
    "Needs Review",
    "Degraded",
    "Failed",
    "Human Decision Gate",
    "/ask-workspace.js"
  ];
  for (const token of required) assert.ok(response.body.includes(token), `/ask/ missing ${token}`);
  const script = await expectOk("/ask-workspace.js");
  for (const stage of ["input", "layer1", "align", "council", "synthesize", "record", "history"]) {
    assert.ok(script.body.includes(`key: '${stage}'`), `Ask workspace script missing ${stage} stage`);
  }
  assert.ok(script.body.includes("NEEDS_REVIEW"), "Ask workspace script missing Needs Review state");
  assert.ok(script.body.includes("DEGRADED"), "Ask workspace script missing Degraded state");
  assert.ok(script.body.includes("FAILED"), "Ask workspace script missing Failed state");
  assert.ok(script.body.includes("/human-decision"), "Ask workspace must preserve server Human Gate endpoint");
  assert.ok(script.body.includes("/api/v1/council/runs?limit=20"), "Ask workspace must load Decision Record history");
}

async function run() {
  const publicRoutes = [
    "/", "/omos", "/ohi", "/models", "/tools", "/artifacts", "/docs", "/shop",
    "/latest-news", "/dashboard", "/legal", "/contact", "/protocol", "/algorithm",
    "/digital-sanctuary", "/ohi-output-pipeline"
  ];

  for (const route of publicRoutes) await expectShell(route);
  await expectAskWorkspace();

  const apiRoutes = ["/api/health", "/api/manifest", "/api/v1/providers", "/api/v1/persistence"];
  for (const route of apiRoutes) await expectJson(route);

  const manifest = await expectJson("/api/manifest");
  assert.equal(manifest.ui?.sharedHeader, true, "manifest must advertise shared header");
  assert.equal(manifest.ui?.sharedFooter, true, "manifest must advertise shared footer");
  assert.equal(manifest.ui?.megaMenu, true, "manifest must advertise mega menu");
  assert.ok(manifest.routes?.public?.includes("/ask/"), "manifest must expose /ask/");

  await expectOk("/omos-ui.css");
  await expectOk("/omos-ui.js");

  console.log("OMOS global UI shell, Ask workspace, and public route tests passed.");
}

run().catch((error) => {
  console.error("Page test failure:", error);
  process.exit(1);
});