const http = require("http");
const assert = require("assert");

const BASE_URL = process.env.OMOS_BASE_URL || "http://localhost:3000";

function request(path) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        const contentType = res.headers["content-type"] || "";
        try {
          resolve({
            statusCode: res.statusCode,
            contentType,
            body: contentType.includes("application/json") ? JSON.parse(data) : data
          });
        } catch (error) {
          reject(error);
        }
      });
    }).on("error", reject);
  });
}

async function expectJson(path, statusCode = 200) {
  const response = await request(path);
  assert.strictEqual(response.statusCode, statusCode, `${path} returned ${response.statusCode}`);
  assert.strictEqual(typeof response.body, "object", `${path} did not return JSON`);
  return response.body;
}

async function expectHtml(path) {
  const response = await request(path);
  assert.strictEqual(response.statusCode, 200, `${path} returned ${response.statusCode}`);
  assert.strictEqual(typeof response.body, "string", `${path} did not return HTML text`);
  assert.ok(response.body.includes("OMOS"), `${path} did not include OMOS text`);
}

async function run() {
  const health = await expectJson("/health");
  assert.strictEqual(health.status, "ok");

  const apiHealth = await expectJson("/api/health");
  assert.strictEqual(apiHealth.status, "ok");

  const manifest = await expectJson("/manifest");
  assert.strictEqual(manifest.id, "omos-site");
  assert.strictEqual(manifest.name, "OMOS Runtime");
  assert.ok(Array.isArray(manifest.publicRoutes));
  assert.ok(manifest.publicRoutes.includes("/omos"));

  const apiManifest = await expectJson("/api/manifest");
  assert.strictEqual(apiManifest.id, "omos-site");

  const tools = await expectJson("/api/tools");
  assert.strictEqual(tools.status, "ok");
  assert.ok(Array.isArray(tools.items));

  const stats = await expectJson("/api/stats");
  assert.strictEqual(stats.status, "ok");
  assert.ok(stats.publicRoutes >= 10);

  for (const route of ["/", "/omos", "/protocol", "/algorithm", "/alignment-api", "/tools", "/docs", "/plugin-bridge", "/legal", "/contact", "/dashboard"]) {
    await expectHtml(route);
  }

  console.log("OMOS smoke tests passed.");
}

run().catch((error) => {
  console.error("Smoke test failure:", error);
  process.exit(1);
});
