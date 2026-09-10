const assert = require('assert');
const {
  runCouncil,
  getCouncilRun,
  listCouncilRuns,
  setHumanDecision,
  verifyCouncilAuditChain
} = require('../src/runtime/orchestrator');
const {
  clearMemoryStoreForTests,
  closeStore
} = require('../src/runtime/decisionStore');

async function expectReject(fn, message) {
  let rejected = false;
  try {
    await fn();
  } catch (error) {
    rejected = true;
    if (message) assert.strictEqual(error.message, message);
  }
  assert.ok(rejected, `Expected rejection${message ? `: ${message}` : ''}`);
}

function assertOrderedStages(record) {
  const ids = record.stages.map((stage) => stage.id);
  assert.deepStrictEqual(ids, [1, 2, 3, 4, 5, 6, 7]);
  for (let i = 1; i < record.stages.length; i += 1) {
    assert.ok(record.stages[i].id > record.stages[i - 1].id, 'stage ids must increase monotonically');
  }
  for (const stage of record.stages.filter((stage) => stage.id < 6)) {
    assert.strictEqual(stage.status, 'COMPLETE', `stage ${stage.id} must complete before human review`);
  }
  assert.strictEqual(record.stages[5].status, 'NEEDS_REVIEW');
  assert.strictEqual(record.stages[6].status, 'PENDING');
}

async function run() {
  delete process.env.DATABASE_URL;
  process.env.NODE_ENV = 'test';
  process.env.OMOS_REQUIRE_DURABLE_DB = 'false';
  clearMemoryStoreForTests();

  const ownerA = { ownerId: 'key_owner_a_123456789012', name: 'owner-a' };
  const ownerB = { ownerId: 'key_owner_b_123456789012', name: 'owner-b' };

  const record = await runCouncil({
    prompt: 'Compare three options, preserve the constraints, identify missing evidence, and require human approval before a final decision.',
    mode: 'simulation',
    owner: ownerA
  });

  assert.strictEqual(record.schemaVersion, '1.4.0');
  assert.strictEqual(record.ownerId, ownerA.ownerId);
  assert.strictEqual(record.currentStage, 6);
  assert.strictEqual(record.outputStatus, 'HUMAN_REVIEW_REQUIRED');
  assertOrderedStages(record);
  assert.strictEqual(record.revision, 1);
  assert.ok(record.recordHash);
  assert.strictEqual(record.previousRecordHash, null);
  const initialHash = record.recordHash;

  // Authenticated ownership: another API-key owner cannot read, list, or approve this record.
  assert.strictEqual(await getCouncilRun(record.requestId, ownerB.ownerId), null);
  assert.ok(!(await listCouncilRuns(20, ownerB.ownerId)).some((item) => item.requestId === record.requestId));
  assert.strictEqual(await setHumanDecision(record.requestId, 'APPROVED', 'unauthorized', ownerB.name, ownerB.ownerId), null);

  const owned = await getCouncilRun(record.requestId, ownerA.ownerId);
  assert.ok(owned);
  assert.strictEqual(owned.requestId, record.requestId);

  const approved = await setHumanDecision(
    record.requestId,
    'APPROVED',
    'P0 controlled approval.',
    ownerA.name,
    ownerA.ownerId
  );
  assert.strictEqual(approved.currentStage, 7);
  assert.strictEqual(approved.outputStatus, 'APPROVED');
  assert.strictEqual(approved.humanGate.decision, 'APPROVED');
  assert.strictEqual(approved.humanGate.reviewer, ownerA.name);
  assert.strictEqual(approved.stages[5].status, 'COMPLETE');
  assert.strictEqual(approved.stages[6].status, 'COMPLETE');
  assert.strictEqual(approved.revision, 2);
  assert.strictEqual(approved.previousRecordHash, initialHash);
  assert.notStrictEqual(approved.recordHash, initialHash);

  // Ordered transition hard gate: terminal records cannot be approved or rejected again.
  await expectReject(
    () => setHumanDecision(record.requestId, 'REJECTED', 'second decision', ownerA.name, ownerA.ownerId),
    'invalid_stage_transition'
  );

  // Audit-chain integrity: revision numbers and SHA-256 links must verify end to end.
  const chain = await verifyCouncilAuditChain(record.requestId, ownerA.ownerId);
  assert.strictEqual(chain.valid, true);
  assert.strictEqual(chain.revisions, 2);
  assert.strictEqual(chain.headHash, approved.recordHash);

  const reopened = await getCouncilRun(record.requestId, ownerA.ownerId);
  assert.strictEqual(reopened.outputStatus, 'APPROVED');
  assert.strictEqual(reopened.revision, 2);
  assert.strictEqual(reopened.recordHash, approved.recordHash);

  await closeStore();
  console.log('P0 Decision Record hardening tests passed.');
}

run().catch(async (error) => {
  console.error('P0 Decision Record hardening test failure:', error);
  await closeStore().catch(() => {});
  process.exit(1);
});
