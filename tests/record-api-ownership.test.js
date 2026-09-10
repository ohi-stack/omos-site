const assert = require('assert');

const BASE = process.env.OMOS_BASE_URL || 'http://127.0.0.1:3000';
const KEY_A = process.env.OMOS_TEST_KEY_A || 'omos_ci_owner_a';
const KEY_B = process.env.OMOS_TEST_KEY_B || 'omos_ci_owner_b';

async function request(path, key, options = {}) {
  return fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      'x-omos-key': key,
      ...(options.headers || {})
    }
  });
}

async function run() {
  const createdResponse = await request('/api/v1/council/run', KEY_A, {
    method: 'POST',
    body: JSON.stringify({
      prompt: 'Create an ownership-isolated Decision Record and require human approval.',
      mode: 'simulation',
      providers: ['openai', 'anthropic']
    })
  });
  assert.strictEqual(createdResponse.status, 200);
  const created = await createdResponse.json();
  const requestId = created.data.requestId;
  assert.ok(requestId);
  assert.ok(created.data.ownerId);

  const ownerRead = await request(`/api/v1/council/runs/${requestId}`, KEY_A);
  assert.strictEqual(ownerRead.status, 200);

  const foreignRead = await request(`/api/v1/council/runs/${requestId}`, KEY_B);
  assert.strictEqual(foreignRead.status, 404, 'foreign owner must receive non-disclosing 404');

  const foreignHistoryResponse = await request('/api/v1/council/runs?limit=100', KEY_B);
  assert.strictEqual(foreignHistoryResponse.status, 200);
  const foreignHistory = await foreignHistoryResponse.json();
  assert.ok(!foreignHistory.data.some((item) => item.requestId === requestId));

  const foreignDecision = await request(`/api/v1/council/runs/${requestId}/human-decision`, KEY_B, {
    method: 'POST',
    body: JSON.stringify({ decision: 'APPROVED', comment: 'must not be accepted' })
  });
  assert.strictEqual(foreignDecision.status, 404);

  const ownerDecision = await request(`/api/v1/council/runs/${requestId}/human-decision`, KEY_A, {
    method: 'POST',
    body: JSON.stringify({ decision: 'APPROVED', comment: 'owner-authorized approval' })
  });
  assert.strictEqual(ownerDecision.status, 200);
  const approved = await ownerDecision.json();
  assert.strictEqual(approved.data.outputStatus, 'APPROVED');
  assert.strictEqual(approved.data.revision, 2);
  assert.ok(approved.data.recordHash);

  console.log('Decision Record API ownership test passed.');
}

run().catch((error) => {
  console.error('Decision Record API ownership test failed:', error);
  process.exit(1);
});
