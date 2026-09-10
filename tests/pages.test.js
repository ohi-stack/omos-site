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

async function expectHomeNavigation() {
  const response = await expectOk("/");
  const expectedSummaries = ["OMOS", "Workspace", "Council", "OLLM", "Tools", "Developers", "Pricing"];
  for (const label of expectedSummaries) {
    assert.ok(response.body.includes(`<summary>${label}</summary>`), `/ missing canonical mega-menu item: ${label}`);
  }
  return response;
}

async function expectAskWorkspace() {
  const response = await expectOk("/ask/");
  const requiredMarkers = [
    "Ask once.",
    "INPUT → LAYER 1 → ALIGNMENT → COUNCIL → SYNTHESIS → HUMAN GATE → RECORD",
    "id=\"stageList\"",
    "id=\"providerGrid\"",
    "id=\"councilOutputs\"",
    "id=\"humanGate\"",
    "id=\"historyList\"",
    "/ask-workspace.js"
  ];
  for (const marker of requiredMarkers) assert.ok(response.body.includes(marker), `/ask/ missing flagship marker: ${marker}`);
  return response;
}

async function expectConvergencePages() {
  const checks = [
    ["/workspace", "Turn a difficult question into a reviewable decision."],
    ["/council", "Multiple models. One governed review."],
    ["/ollm", "OneGodian LLM"],
    ["/models", "OMOS Model Connectors"],
    ["/tools", "Capability rule"],
    ["/developers", "Canonical Engineering Council"],
    ["/pricing", "Commerce integrity rule"],
    ["/reference-run", "OMOS-REF-0001"],
    ["/belief-mapper", "Seven belief dimensions"]
  ];
  for (const [path, marker] of checks) {
    const response = await expectShell(path);
    assert.ok(response.body.includes(marker), `${path} missing convergence marker: ${marker}`);
  }
}

async function run() {
  const publicRoutes = [
    "/", "/omos", "/workspace", "/council", "/ollm", "/ohi", "/models", "/tools",
    "/belief-mapper", "/developers", "/reference-run", "/pricing", "/artifacts", "/docs", "/shop",
    "/latest-news", "/dashboard", "/legal", "/contact", "/protocol", "/algorithm",
    "/digital-sanctuary", "/ohi-output-pipeline"
  ];

  for (const route of publicRoutes) {
    if (route === "/") await expectOk(route);
    else await expectShell(route);
  }
  await expectHomeNavigation();
  await expectAskWorkspace();
  await expectConvergencePages();

  const apiRoutes = ["/api/health", "/api/manifest", "/api/v1/providers", "/api/v1/persistence"];
  for (const route of apiRoutes) await expectJson(route);

  const manifest = await expectJson("/api/manifest");
  assert.equal(manifest.ui?.sharedHeader, true, "manifest must advertise shared header");
  assert.equal(manifest.ui?.sharedFooter, true, "manifest must advertise shared footer");
  assert.equal(manifest.ui?.megaMenu, true, "manifest must advertise mega menu");
  assert.deepEqual(manifest.navigation?.map((item) => item.label), ["OMOS","Workspace","Council","OLLM","Tools","Developers","Pricing"], "manifest must expose the canonical seven-item mega menu");
  assert.ok(manifest.routes?.public?.includes("/ask/"), "manifest must advertise /ask/");
  assert.ok(manifest.routes?.public?.includes("/reference-run"), "manifest must advertise /reference-run");
  assert.ok(manifest.routes?.public?.includes("/belief-mapper"), "manifest must advertise /belief-mapper");
  assert.deepEqual(manifest.orchestration?.stages, ["ask","layer1","alignment","council_review","governed_synthesis","human_gate","decision_record"], "manifest must preserve canonical governed runtime stages");

  await expectOk("/omos-ui.css");
  await expectOk("/omos-ui.js");
  await expectOk("/ask-workspace.js");

  console.log("OMOS global UI shell, canonical mega menu, convergence pages, Ask OMOS workspace, and public route tests passed.");
}

run().catch((error) => {
  console.error("Page test failure:", error);
  process.exit(1);
});