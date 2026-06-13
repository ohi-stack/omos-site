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

async function run() {
  const publicRoutes = [
    "/",
    "/omos",
    "/ohi",
    "/models",
    "/tools",
    "/tools/bridge-builder/",
    "/artifacts",
    "/docs",
    "/shop",
    "/latest-news",
    "/dashboard",
    "/legal",
    "/contact",
    "/protocol",
    "/algorithm",
    "/digital-sanctuary",
    "/ohi-output-pipeline"
  ];

  for (const route of publicRoutes) {
    await expectOk(route);
  }

  const apiRoutes = [
    "/api/health",
    "/api/manifest",
    "/api/ecosystem",
    "/api/tools",
    "/api/artifacts",
    "/api/docs",
    "/api/bridge/status"
  ];

  for (const route of apiRoutes) {
    await expectJson(route);
  }

  console.log("OMOS page and API route tests passed.");
}

run().catch((error) => {
  console.error("Page test failure:", error);
  process.exit(1);
});
