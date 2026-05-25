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
        try {
          resolve({
            statusCode: res.statusCode,
            body: JSON.parse(data)
          });
        } catch (error) {
          reject(error);
        }
      });
    }).on("error", reject);
  });
}

async function run() {
  const health = await request("/health");
  assert.strictEqual(health.statusCode, 200);
  assert.strictEqual(health.body.status, "ok");

  const manifest = await request("/manifest");
  assert.strictEqual(manifest.statusCode, 200);
  assert.strictEqual(manifest.body.id, "omos-site");
  assert.strictEqual(manifest.body.name, "OMOS Runtime");

  console.log("OMOS smoke tests passed.");
}

run().catch((error) => {
  console.error("Smoke test failure:", error);
  process.exit(1);
});
