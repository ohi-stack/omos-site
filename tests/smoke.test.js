const http = require("http");
const assert = require("assert");

const BASE_URL = process.env.OMOS_BASE_URL || "http://localhost:3000";

function request(path, parseJson = true, redirects = 0) {
  return new Promise((resolve, reject) => {
    const target = new URL(path, BASE_URL);
    http.get(target, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location && redirects < 5) {
        res.resume();
        return resolve(request(new URL(res.headers.location, target).pathname, parseJson, redirects + 1));
      }
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
  assert.strictEqual(response.statusCode, 200, `${path} returned ${response.statusCode}`);
  assert.ok(String(response.headers["content-type"] || "").includes("text/html"), `${path} did not return HTML`);
  assert.ok(response.body.includes(text), `${path} missing canonical marker: ${text}`);
}

async function run() {
  const health = await checkJson("/health", { status: "ok", service: "omos-site" });
  assert.ok(health.version);
  assert.ok(health.persistence);
  assert.ok(["memory", "postgresql"].includes(health.persistence.backend));
  assert.ok(health.orchestration);
  assert.ok(Array.isArray(health.orchestration.providers));

  await checkJson("/api/health", { status: "ok", service: "omos-site" });

  const manifest = await checkJson("/manifest", { id: "omos-site", name: "OMOS Runtime" });
  assert.ok(manifest.routes.public.includes("/dashboard"));
  assert.ok(manifest.routes.public.includes("/workspace"));
  assert.ok(manifest.routes.public.includes("/tools/belief-mapper"));
  assert.ok(manifest.wordpressPlugin.compatibleHosts.length >= 1);

  await checkJson("/api/manifest", { id: "omos-site", name: "OMOS Runtime" });

  const routes = [
    ["/", "OMOS"],
    ["/omos", "One runtime for governed AI-assisted decisions"],
    ["/workspace", "Ask. Review. Decide. Reopen."],
    ["/council", "Compare perspectives without manufacturing consensus."],
    ["/ollm", "OneGodian LLM"],
    ["/ohi", "O-H-I"],
    ["/models", "Model Connectors Control Center"],
    ["/tools", "Tools that turn complexity into structured work."],
    ["/developers", "Build against the runtime, not assumptions."],
    ["/artifacts", "OMOS Canon & Artifact Library"],
    ["/docs", "OMOS Documentation"],
    ["/shop", "Products & Services"],
    ["/latest-news", "Build Notes"],
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
