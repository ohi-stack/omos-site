const http = require("http");
const https = require("https");
const assert = require("assert");

const BASE_URL = process.env.OMOS_BASE_URL || "http://localhost:3000";
const CANONICAL_NAV = ["OMOS", "Workspace", "Council", "OLLM", "Tools", "Developers", "Pricing"];

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
  for (const label of CANONICAL_NAV) {
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

async function expectBlackGoldStandard() {
  const uiCss = await expectOk("/omos-ui.css");
  assert.ok(uiCss.body.includes("@import url('/omos-black-gold.css')"), "global UI must load canonical black-gold stylesheet");
  assert.ok(uiCss.body.includes("@import url('/omos-black-gold-ask.css')"), "global UI must load Ask OMOS black-gold compatibility stylesheet");

  const theme = await expectOk("/omos-black-gold.css");
  assert.ok(theme.body.includes("#020305"), "black-gold standard must define the obsidian page background");
  assert.ok(theme.body.includes("/omos-logo-gold.png"), "black-gold standard must use the official gold OMOS logo");
  assert.ok(theme.body.includes("body.omos-shell-active"), "black-gold standard must target shared-shell public pages");

  const askTheme = await expectOk("/omos-black-gold-ask.css");
  assert.ok(askTheme.body.includes(".ask-brand-mark"), "Ask OMOS theme must replace the legacy square brand mark");
  assert.ok(askTheme.body.includes("/omos-logo-gold.png"), "Ask OMOS must use the official gold OMOS logo");
  await expectOk("/omos-logo-gold.png");

  const contentTheme = await expectOk("/content-pages.css");
  assert.ok(contentTheme.body.includes("@import url('/omos-black-gold.css')"), "consolidated content pages must inherit the canonical black-gold visual standard");
}

async function expectHtmlMarker(path, marker) {
  const response = await expectOk(path);
  assert.ok(String(response.headers["content-type"] || "").includes("text/html"), `${path} must render HTML`);
  assert.ok(response.body.includes(marker), `${path} missing marker: ${marker}`);
  return response;
}

async function run() {
  const publicRoutes = [
    "/", "/omos", "/workspace", "/council", "/ollm", "/ohi", "/models", "/tools", "/developers", "/pricing",
    "/artifacts", "/docs", "/shop", "/latest-news", "/dashboard", "/legal", "/contact", "/protocol", "/algorithm",
    "/digital-sanctuary", "/ohi-output-pipeline"
  ];

  for (const route of publicRoutes) {
    if (route === "/") await expectOk(route);
    else await expectShell(route);
  }
  await expectHomeNavigation();
  await expectAskWorkspace();
  await expectBlackGoldStandard();

  const cleanContentRoutes = [
    ["/status", "Production certification"],
    ["/omos-ref-0001", "OMOS-REF-0001"],
    ["/connections", "Connection & Adaptation Layer"],
    ["/engineering-council", "Engineering Council Lifecycle"],
    ["/mcp", "OneGodian MCP"],
    ["/council-provenance", "Provenance precedes synthesis"],
    ["/verification", "Agreement is not proof"],
    ["/tools/belief-mapper", "Belief Mapper"],
    ["/tools/declaration-generator", "Declaration Generator"],
    ["/tools/time-converter", "OTS-V5"],
    ["/tools/protocol-explorer", "Protocol Explorer"],
    ["/tools/algorithm-visualizer", "Observe"],
    ["/models/openai", "GPT-6 Astra"],
    ["/models/anthropic", "Anthropic"],
    ["/models/gemini", "Gemini"],
    ["/models/xai", "Grok"],
    ["/docs/protocol-spec", "OneGodian Protocol"],
    ["/docs/algorithm-spec", "OneGodian Algorithm"],
    ["/docs/system-prompt", "system prompt"],
    ["/docs/api-manifest", "Runtime manifest"],
    ["/docs/compliance", "Compliance"],
    ["/docs/version-history", "OMOS 1.1"],
    ["/docs/sitemap", "OMOS live-site map"]
  ];
  for (const [route, marker] of cleanContentRoutes) await expectHtmlMarker(route, marker);

  const apiRoutes = ["/api/health", "/api/manifest", "/api/v1/providers", "/api/v1/persistence"];
  for (const route of apiRoutes) await expectJson(route);

  const providers = await expectJson("/api/v1/providers");
  assert.ok(Array.isArray(providers.providers), "provider endpoint must return providers array");
  assert.equal(providers.providers.length, 4, "provider endpoint must expose four Council provider interfaces");
  assert.ok(providers.providers.every((p) => Object.prototype.hasOwnProperty.call(p, "connectionTested")), "provider status must distinguish configuration from connection testing");

  const manifest = await expectJson("/api/manifest");
  assert.equal(manifest.ui?.sharedHeader, true, "manifest must advertise shared header");
  assert.equal(manifest.ui?.sharedFooter, true, "manifest must advertise shared footer");
  assert.equal(manifest.ui?.megaMenu, true, "manifest must advertise mega menu");
  assert.equal(manifest.ui?.megaMenuColumns, 6, "manifest must advertise six-column mega menu architecture");
  assert.deepEqual(manifest.navigation?.map((item) => item.label), CANONICAL_NAV, "manifest must expose the canonical seven-item mega menu");
  assert.ok(manifest.routes?.public?.includes("/ask/"), "manifest must advertise /ask/");
  assert.ok(manifest.routes?.public?.includes("/tools/belief-mapper"), "manifest must advertise Belief Mapper clean route");
  assert.ok(manifest.routes?.public?.includes("/connections"), "manifest must advertise Connection Layer clean route");
  assert.deepEqual(manifest.orchestration?.stages, ["ask","layer1","alignment","council_review","governed_synthesis","human_gate","decision_record"], "manifest must preserve canonical governed runtime stages");
  assert.equal(manifest.orchestration?.modelAgreementIsNotFactualVerification, true, "manifest must preserve verification boundary");

  await expectOk("/omos-ui.css");
  await expectOk("/mega-menu-v2.css");
  await expectOk("/omos-ui.js");
  await expectOk("/ask-workspace.js");
  await expectOk("/content-pages.css");

  console.log("OMOS black-gold shell, seven-area navigation, flagship workspace, consolidated content/tool/model pages, manifest, and provider-boundary tests passed.");
}

run().catch((error) => {
  console.error("Page test failure:", error);
  process.exit(1);
});