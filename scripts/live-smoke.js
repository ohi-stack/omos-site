const https = require('https');

const BASE = (process.env.OMOS_BASE_URL || 'https://omos.onegodian.com').replace(/\/$/, '');
const EXPECTED_VERSION = process.env.OMOS_EXPECTED_VERSION || '1.1.0';

function request(path) {
  return new Promise((resolve, reject) => {
    const req = https.get(`${BASE}${path}`, { timeout: 20000, headers: { Accept: '*/*' } }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body, headers: res.headers }));
    });
    req.on('timeout', () => req.destroy(new Error(`timeout: ${path}`)));
    req.on('error', reject);
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function json(path) {
  const res = await request(path);
  assert(res.status === 200, `${path} returned HTTP ${res.status}`);
  try { return JSON.parse(res.body); } catch { throw new Error(`${path} did not return JSON`); }
}

async function ok(path) {
  const res = await request(path);
  assert([200, 301, 302].includes(res.status), `${path} returned HTTP ${res.status}`);
  return res;
}

async function run() {
  console.log(`Verifying OMOS canonical runtime: ${BASE}`);

  const health = await json('/api/health');
  assert(health.status === 'ok', '/api/health status must be ok');
  assert(health.version === EXPECTED_VERSION, `live runtime version ${health.version} != expected ${EXPECTED_VERSION}`);

  const manifest = await json('/api/manifest');
  assert(manifest.version === EXPECTED_VERSION, `manifest version ${manifest.version} != expected ${EXPECTED_VERSION}`);
  assert(manifest.canonicalHost === BASE, `manifest canonicalHost ${manifest.canonicalHost} != ${BASE}`);

  const persistence = await json('/api/v1/persistence');
  assert(persistence.persistence?.backend === 'postgresql', `persistence backend is ${persistence.persistence?.backend || 'unknown'}, expected postgresql`);
  assert(persistence.persistence?.durable === true, 'durable PostgreSQL persistence is not active');

  await json('/api/v1/providers');
  await ok('/');
  await ok('/ask/');
  await ok('/dashboard');
  await ok('/ohi-output-pipeline');
  await ok('/sitemap.xml');

  console.log(`OMOS live smoke PASSED. version=${EXPECTED_VERSION} persistence=postgresql`);
}

run().catch((error) => {
  console.error(`OMOS live smoke FAILED: ${error.message}`);
  process.exit(1);
});
