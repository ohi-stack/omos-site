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
const { verifyOruValenContext } = require('../src/runtime/oruValen');

async function run() {
  const prompt = 'A small organization has limited capital and three possible investments. Which should it prioritize, what evidence is missing, and under what conditions should the recommendation change?';

  const layer1 = distillPrompt(prompt, { test: true });
  assert.strictEqual(layer1.status, 'COMPLETE');
  assert.ok(layer1.canonicalInput.includes('limited capital'));
  assert.ok(layer1.meaningUnits.length >= 1);

  const alignment = scoreAlignment(layer1);
  assert.strictEqual(alignment.status, 'COMPLETE');
  assert.ok(alignment.overallScore >= 0 && alignment.overallScore <= 1);
  assert.ok(alignment.state);

  const submittedContext = {
    subject: 'Council snapshot test',
    items: [
      {
        id: 'decision_1',
        memoryClass: 'decision_memory',
        epistemicClass: 'stated_position',
        content: 'Persist context before action.',
        source: { ref: 'test:decision_1', status: 'caller_supplied_unverified' },
        providerUse: true
      },
      {
        id: 'private_1',
        memoryClass: 'lived_experience',
        content: 'Do not disclose this item.',
        providerUse: false
      }
    ]
  };
  const record = await runCouncil({ prompt, context: { oruValen: submittedContext }, mode: 'simulation' });
  submittedContext.items[0].content = 'Mutated after the run.';
  assert.ok(record.requestId.startsWith('omos_run_'));
  assert.strictEqual(record.schemaVersion, '1.4.0');
  assert.strictEqual(record.mode, 'simulation');
  assert.strictEqual(record.currentStage, 6);
  assert.strictEqual(record.outputStatus, 'HUMAN_REVIEW_REQUIRED');
  assert.strictEqual(record.verificationStatus, 'not_factually_verified');
  assert.strictEqual(record.stages.length, 7);
  assert.ok(record.persistence);
  assert.equal(record.oruContext.status, 'attached');
  assert.equal(record.oruContext.snapshot.items[0].content, 'Persist context before action.');
  assert.equal(record.oruContext.providerProjection.items.length, 1);
  assert.ok(!JSON.stringify(record.oruContext.providerProjection).includes('Do not disclose this item.'));
  assert.equal(record.contextHash, record.oruContext.snapshotHash);
  assert.equal(verifyOruValenContext(record.oruContext), true);
  assert.equal(record.oruContext.capabilities.approvedSourceRetrieval, false);
  assert.equal(record.oruContext.capabilities.accHandoff, false);
  assert.equal(record.oruContext.capabilities.outcomeIngestion, false);
  assert.equal(record.oruContext.capabilities.digitalTwinLoopComplete, false);

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

  const stored = await getCouncilRun(record.requestId);
  assert.ok(stored);
  assert.strictEqual(stored.requestId, record.requestId);
  assert.equal(stored.oruContext.snapshotHash, record.oruContext.snapshotHash);
  assert.equal(verifyOruValenContext(stored.oruContext), true);

  const approved = await setHumanDecision(record.requestId, 'APPROVED', 'Controlled test approval.', 'workspace-test');
  assert.ok(approved);
  assert.strictEqual(approved.currentStage, 7);
  assert.strictEqual(approved.outputStatus, 'APPROVED');
  assert.strictEqual(approved.humanGate.decision, 'APPROVED');
  assert.strictEqual(approved.humanGate.reviewer, 'workspace-test');
  assert.strictEqual(approved.stages[5].status, 'COMPLETE');
  assert.strictEqual(approved.stages[6].status, 'COMPLETE');
  assert.ok(approved.recordHash);

  const reopened = await getCouncilRun(record.requestId);
  assert.strictEqual(reopened.outputStatus, 'APPROVED');
  assert.strictEqual(reopened.humanGate.decision, 'APPROVED');

  const history = await listCouncilRuns(20);
  assert.ok(history.some((item) => item.requestId === record.requestId));

  const persistence = getPersistenceStatus();
  assert.ok(['memory', 'postgresql'].includes(persistence.backend));

  console.log(`OMOS workspace lifecycle tests passed. persistence=${persistence.backend}`);
}

run().catch((error) => {
  console.error('Workspace lifecycle failure:', error);
  process.exit(1);
});
