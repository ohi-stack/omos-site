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

async function run() {
  const publicRoutes = [
    "/", "/omos", "/workspace", "/council", "/ollm", "/tools", "/developers", "/pricing",
    "/ohi", "/models", "/artifacts", "/docs", "/shop", "/latest-news", "/dashboard", "/legal", "/contact",
    "/protocol", "/algorithm", "/digital-sanctuary", "/ohi-output-pipeline",
    "/distill", "/alignment", "/decision-records", "/gcd-synthesis", "/council-provenance", "/verification",
    "/connections", "/engineering-council", "/mcp", "/reference-run", "/status", "/founder", "/standards",
    "/research", "/ecosystem", "/developers/agents"
  ];

  for (const route of publicRoutes) {
    if (route === "/") await expectOk(route);
    else await expectShell(route);
  }

  await expectHomeNavigation();
  await expectAskWorkspace();

  const contentMarkers = {
    "/workspace": "Turn a difficult question into a reviewable decision.",
    "/council": "structured disagreement",
    "/ollm": "OneGodian LLM inside the OMOS model architecture.",
    "/distill": "OMOS Distill",
    "/alignment": "OMOS Alignment Engine",
    "/decision-records": "OMOS Decision Record",
    "/gcd-synthesis": "Evidence outranks consensus",
    "/council-provenance": "Provenance Before Synthesis",
    "/verification": "Agreement is not verification.",
    "/connections": "Connection & Adaptation Layer",
    "/engineering-council": "Issue → Classify → Assign → Implement",
    "/mcp": "MCP is an interoperability layer",
    "/reference-run": "OMOS-REF-0001",
    "/status": "Conceptual → Prototype → Functional → Verified → Production",
    "/founder": "Gregory Lamar Jones",
    "/standards": "OMOS Standards",
    "/research": "OMOS Research",
    "/ecosystem": "larger OneGodian digital ecosystem"
  };

  for (const [route, marker] of Object.entries(contentMarkers)) {
    const response = await expectOk(route);
    assert.ok(response.body.includes(marker), `${route} missing content marker: ${marker}`);
  }

  const apiRoutes = ["/api/health", "/api/manifest", "/api/v1/providers", "/api/v1/persistence"];
  for (const route of apiRoutes) await expectJson(route);

  const manifest = await expectJson("/api/manifest");
  assert.equal(manifest.ui?.sharedHeader, true, "manifest must advertise shared header");
  assert.equal(manifest.ui?.sharedFooter, true, "manifest must advertise shared footer");
  assert.equal(manifest.ui?.megaMenu, true, "manifest must advertise mega menu");
  assert.equal(manifest.ui?.megaMenuColumns, 6, "manifest must advertise six mega-menu columns");
  assert.deepEqual(manifest.navigation?.map((item) => item.label), ["OMOS", "Workspace", "Council", "OLLM", "Tools", "Developers", "Pricing"], "manifest must expose the canonical seven-area mega menu");
  assert.ok(manifest.routes?.public?.includes("/ask/"), "manifest must advertise /ask/");
  assert.ok(manifest.routes?.public?.includes("/gcd-synthesis"), "manifest must advertise GCD Synthesis");
  assert.ok(manifest.routes?.public?.includes("/reference-run"), "manifest must advertise OMOS-REF-0001");
  assert.ok(manifest.routes?.public?.includes("/developers/agents"), "manifest must advertise developer agent documentation");
  assert.deepEqual(manifest.orchestration?.stages, ["ask", "layer1", "alignment", "council_review", "governed_synthesis", "human_gate", "decision_record"], "manifest must preserve canonical governed runtime stages");

  await expectOk("/omos-ui.css");
  await expectOk("/omos-ui.js");
  await expectOk("/ask-workspace.js");
  await expectOk("/sitemap.xml");

  console.log("OMOS consolidated public architecture, global shell, seven-area navigation, Ask OMOS workspace, and route tests passed.");
}

run().catch((error) => {
  console.error("Page test failure:", error);
  process.exit(1);
});
