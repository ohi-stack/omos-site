const http = require('http');
const assert = require('assert');

const BASE_URL = process.env.OMOS_BASE_URL || 'http://localhost:3000';

function request(path, method = 'GET', body) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: url.hostname,
      port: url.port || 80,
      path: `${url.pathname}${url.search}`,
      method,
      headers: payload ? { 'content-type': 'application/json', 'content-length': Buffer.byteLength(payload) } : {},
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function run() {
  const processResponse = await request('/process', 'POST', { input: 'security smoke test' });
  assert.strictEqual(processResponse.statusCode, 401, '/process must reject requests without x-omos-key');

  const councilResponse = await request('/api/v1/council/run', 'POST', { question: 'security smoke test' });
  assert.strictEqual(councilResponse.statusCode, 401, '/api/v1/council/run must reject requests without x-omos-key');

  const runsResponse = await request('/api/v1/council/runs');
  assert.strictEqual(runsResponse.statusCode, 401, '/api/v1/council/runs must reject requests without x-omos-key');

  console.log('OMOS security smoke tests passed.');
}

run().catch((error) => {
  console.error('Security smoke test failure:', error);
  process.exit(1);
});
