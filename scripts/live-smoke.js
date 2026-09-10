const https = require('https');

const BASE = (process.env.OMOS_BASE_URL || 'https://omos.onegodian.com').replace(/\/$/, '');
const EXPECTED_VERSION = process.env.OMOS_EXPECTED_VERSION || '1.1.0';
const EXPECTED_SHA = String(process.env.OMOS_EXPECTED_SHA || '').trim();

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

  const build = await json('/build.json');
  assert(build.service === 'omos-site', `build metadata service ${build.service || 'unknown'} != omos-site`);
  assert(build.version === EXPECTED_VERSION, `build metadata version ${build.version} != expected ${EXPECTED_VERSION}`);
  assert(build.provenance === 'runtime-resolved', `build provenance is ${build.provenance || 'unknown'}, expected runtime-resolved`);
  assert(build.buildSha && build.buildSha !== 'unknown', 'build SHA is unresolved');
  if (EXPECTED_SHA) {
    assert(build.buildSha === EXPECTED_SHA, `live build SHA ${build.buildSha} != expected ${EXPECTED_SHA}`);
  }

  const persistence = await json('/api/v1/persistence');
  assert(persistence.persistence?.backend === 'postgresql', `persistence backend is ${persistence.persistence?.backend || 'unknown'}, expected postgresql`);
  assert(persistence.persistence?.durable === true, 'durable PostgreSQL persistence is not active');
  assert(persistence.persistence?.initialized === true, 'PostgreSQL persistence is not initialized');
  assert(!persistence.persistence?.error, `persistence reports error: ${persistence.persistence?.error}`);

  const providerResponse = await json('/api/v1/providers');
  assert(Array.isArray(providerResponse.providers), 'provider status payload must include providers');

  await ok('/');
  await ok('/ask/');
  await ok('/dashboard');
  await ok('/ohi-output-pipeline');
  await ok('/sitemap.xml');

  const evidence = {
    status: 'PASS',
    checkedAtUtc: new Date().toISOString(),
    canonicalHost: BASE,
    version: health.version,
    buildSha: build.buildSha,
    persistence: {
      backend: persistence.persistence.backend,
      durable: persistence.persistence.durable,
      initialized: persistence.persistence.initialized
    },
    providers: providerResponse.providers.map((item) => ({
      provider: item.provider,
      configured: item.configured,
      status: item.status
    }))
  };

  console.log('OMOS live production evidence PASSED.');
  console.log(JSON.stringify(evidence, null, 2));
}

run().catch((error) => {
  console.error(`OMOS live production evidence FAILED: ${error.message}`);
  process.exit(1);
});
