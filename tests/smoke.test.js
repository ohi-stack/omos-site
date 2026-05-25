const http = require("http");
const assert = require("assert");

const BASE_URL = process.env.OMOS_BASE_URL || "http://localhost:3000";

function request(path, parseJson = true) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: parseJson ? JSON.parse(data) : data
        });
      });
    }).on("error", reject);
  });
}

async function checkJson(path, expected) {
  const response = await request(path, true);
  assert.strictEqual(response.statusCode, 200);
  for (const [key, value] of Object.entries(expected)) {
    assert.strictEqual(response.body[key], value);
  }
  return response.body;
}

async function checkHtml(path, text) {
  const response = await request(path, false);
  assert.strictEqual(response.statusCode, 200);
  assert.ok(String(response.headers["content-type"] || "").includes("text/html"));
  assert.ok(response.body.includes(text));
}

async function run() {
  const health = await checkJson("/health", { status: "ok", service: "omos-site" });
  assert.ok(health.version);
  assert.ok(health.publicRouteCount >= 10);

  await checkJson("/api/health", { status: "ok", service: "omos-site" });

  const manifest = await checkJson("/manifest", { id: "omos-site", name: "OMOS Runtime" });
  assert.ok(manifest.routes.public.includes("/dashboard"));
  assert.ok(manifest.wordpressPlugin.compatibleHosts.length >= 1);
  assert.ok(manifest.commerceBridge.primaryStore);

  await checkJson("/api/manifest", { id: "omos-site", name: "OMOS Runtime" });

  const routes = [
    ["/", "OMOS"],
    ["/omos", "OMOS"],
    ["/ohi", "OHI"],
    ["/models", "Model"],
    ["/tools", "Tools"],
    ["/artifacts", "Artifacts"],
    ["/docs", "Docs"],
    ["/shop", "Shop"],
    ["/latest-news", "News"],
    ["/dashboard", "Dashboard"],
    ["/legal", "Legal"],
    ["/contact", "Contact"],
    ["/protocol", "Protocol"],
    ["/algorithm", "Algorithm"],
    ["/digital-sanctuary", "Digital Sanctuary"]
  ];

  for (const [path, expectedText] of routes) {
    await checkHtml(path, expectedText);
  }

  console.log("OMOS smoke tests passed.");
}

run().catch((error) => {
  console.error("Smoke test failure:", error);
  globalThis.process.exit(1);
});
