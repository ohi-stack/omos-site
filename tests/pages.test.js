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

async function expectStaticPage(path, marker) {
  const response = await expectOk(path);
  assert.ok(String(response.headers["content-type"] || "").includes("text/html"), `${path} must render HTML`);
  assert.ok(response.body.includes(marker), `${path} missing marker: ${marker}`);
}

async function run() {
  const shellRoutes = [
    "/omos", "/workspace", "/council", "/ollm", "/tools", "/developers", "/pricing",
    "/ohi", "/models", "/artifacts", "/docs", "/shop", "/latest-news", "/dashboard",
    "/legal", "/contact", "/protocol", "/algorithm", "/digital-sanctuary", "/ohi-output-pipeline"
  ];
  await expectOk("/");
  for (const route of shellRoutes) await expectShell(route);
  await expectHomeNavigation();
  await expectAskWorkspace();

  const staticPages = [
    ["/status-2026-09-10.html", "Production certification"],
    ["/omos-ref-0001.html", "OMOS-REF-0001"],
    ["/connections.html", "Connection & Adaptation Layer"],
    ["/engineering-council.html", "Engineering Council Lifecycle"],
    ["/mcp.html", "OneGodian MCP"],
    ["/council-provenance.html", "Provenance precedes synthesis"],
    ["/verification.html", "Agreement is not proof"],
    ["/ollm.html", "OneGodian LLM"],
    ["/developers.html", "Developer Hub"],
    ["/tools/belief-mapper.html", "Belief Mapper"],
    ["/tools/declaration-generator.html", "Declaration Generator"],
    ["/tools/time-converter.html", "OTS-V5"],
    ["/tools/protocol-explorer.html", "Protocol Explorer"],
    ["/tools/algorithm-visualizer.html", "Observe"],
    ["/models/openai.html", "GPT-6 Astra"],
    ["/models/anthropic.html", "Anthropic"],
    ["/models/gemini.html", "Gemini"],
    ["/models/xai.html", "Grok"],
    ["/docs/protocol-spec.html", "OneGodian Protocol"],
    ["/docs/algorithm-spec.html", "OneGodian Algorithm"],
    ["/docs/system-prompt.html", "system prompt"],
    ["/docs/api-manifest.html", "Runtime manifest"],
    ["/docs/compliance.html", "Compliance"],
    ["/docs/version-history.html", "OMOS 1.1"],
    ["/docs/sitemap.html", "OMOS live-site map"]
  ];
  for (const [path, marker] of staticPages) await expectStaticPage(path, marker);

  const apiRoutes = ["/api/health", "/api/manifest", "/api/v1/providers", "/api/v1/persistence"];
  for (const route of apiRoutes) await expectJson(route);

  const manifest = await expectJson("/api/manifest");
  assert.equal(manifest.ui?.sharedHeader, true, "manifest must advertise shared header");
  assert.equal(manifest.ui?.sharedFooter, true, "manifest must advertise shared footer");
  assert.equal(manifest.ui?.megaMenu, true, "manifest must advertise mega menu");
  assert.deepEqual(manifest.navigation?.map((item) => item.label), ["OMOS","Workspace","Council","OLLM","Tools","Developers","Pricing"], "manifest must expose the canonical seven-item mega menu");
  assert.ok(manifest.routes?.public?.includes("/ask/"), "manifest must advertise /ask/");
  assert.deepEqual(manifest.orchestration?.stages, ["ask","layer1","alignment","council_review","governed_synthesis","human_gate","decision_record"], "manifest must preserve canonical governed runtime stages");

  await expectOk("/omos-ui.css");
  await expectOk("/mega-menu-v2.css");
  await expectOk("/omos-ui.js");
  await expectOk("/ask-workspace.js");
  await expectOk("/content-pages.css");

  console.log("OMOS shell, canonical navigation, flagship workspace, consolidated content pages, and runtime API tests passed.");
}

run().catch((error) => {
  console.error("Page test failure:", error);
  process.exit(1);
});