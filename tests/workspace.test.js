const assert = require('assert');
const {
  runCouncil,
  getCouncilRun,
  listCouncilRuns,
  setHumanDecision,
  distillPrompt,
  scoreAlignment,
  getPersistenceStatus
} = require('../src/runtime/orchestrator');

async function run() {
  process.env.NODE_ENV = 'test';
  process.env.OMOS_REQUIRE_DURABLE_DB = 'false';
  const owner = { ownerId: 'key_workspace_test_owner', name: 'workspace-test' };
  const prompt = 'A small organization has limited capital and three possible investments. Which should it prioritize, what evidence is missing, and under what conditions should the recommendation change?';

  const layer1 = distillPrompt(prompt, { test: true });
  assert.strictEqual(layer1.status, 'COMPLETE');
  assert.ok(layer1.canonicalInput.includes('limited capital'));
  assert.ok(layer1.meaningUnits.length >= 1);

  const alignment = scoreAlignment(layer1);
  assert.strictEqual(alignment.status, 'COMPLETE');
  assert.ok(alignment.overallScore >= 0 && alignment.overallScore <= 1);
  assert.ok(alignment.state);

  const record = await runCouncil({ prompt, mode: 'simulation', owner });
  assert.ok(record.requestId.startsWith('omos_run_'));
  assert.strictEqual(record.schemaVersion, '1.4.0');
  assert.strictEqual(record.mode, 'simulation');
  assert.strictEqual(record.ownerId, owner.ownerId);
  assert.strictEqual(record.currentStage, 6);
  assert.strictEqual(record.outputStatus, 'HUMAN_REVIEW_REQUIRED');
  assert.strictEqual(record.verificationStatus, 'not_factually_verified');
  assert.strictEqual(record.stages.length, 7);
  assert.ok(record.persistence);
  assert.strictEqual(record.revision, 1);
  assert.ok(record.recordHash);

  const expected = [
    'Ask OMOS',
    'Layer 1',
    'Alignment',
    'Council Review',
    'Governed Synthesis',
    'Human Gate',
    'Decision Record'
  ];

  assert.deepStrictEqual(record.stages.map((stage) => stage.label), expected);
  assert.strictEqual(record.stages[0].status, 'COMPLETE');
  assert.strictEqual(record.stages[1].status, 'COMPLETE');
  assert.strictEqual(record.stages[2].status, 'COMPLETE');
  assert.strictEqual(record.stages[3].status, 'COMPLETE');
  assert.strictEqual(record.stages[4].status, 'COMPLETE');
  assert.strictEqual(record.stages[5].status, 'NEEDS_REVIEW');
  assert.strictEqual(record.stages[6].status, 'PENDING');

  assert.ok(record.layer1);
  assert.ok(record.alignment);
  assert.ok(Array.isArray(record.round1));
  assert.ok(Array.isArray(record.crossModelReview));
  assert.ok(record.signals);
  assert.ok(record.governedOutput);
  assert.strictEqual(record.governedOutput.verificationState, 'NOT_FACTUALLY_VERIFIED');
  assert.strictEqual(record.humanGate.decision, null);

  const stored = await getCouncilRun(record.requestId, owner.ownerId);
  assert.ok(stored);
  assert.strictEqual(stored.requestId, record.requestId);

  const approved = await setHumanDecision(record.requestId, 'APPROVED', 'Controlled test approval.', owner.name, owner.ownerId);
  assert.ok(approved);
  assert.strictEqual(approved.currentStage, 7);
  assert.strictEqual(approved.outputStatus, 'APPROVED');
  assert.strictEqual(approved.humanGate.decision, 'APPROVED');
  assert.strictEqual(approved.humanGate.reviewer, owner.name);
  assert.strictEqual(approved.stages[5].status, 'COMPLETE');
  assert.strictEqual(approved.stages[6].status, 'COMPLETE');
  assert.ok(approved.recordHash);
  assert.strictEqual(approved.revision, 2);

  const reopened = await getCouncilRun(record.requestId, owner.ownerId);
  assert.strictEqual(reopened.outputStatus, 'APPROVED');
  assert.strictEqual(reopened.humanGate.decision, 'APPROVED');

  const history = await listCouncilRuns(20, owner.ownerId);
  assert.ok(history.some((item) => item.requestId === record.requestId));

  const persistence = getPersistenceStatus();
  assert.ok(['memory', 'postgresql'].includes(persistence.backend));

  console.log(`OMOS workspace lifecycle tests passed. persistence=${persistence.backend}`);
}

run().catch((error) => {
  console.error('Workspace lifecycle failure:', error);
  process.exit(1);
});
