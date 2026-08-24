const assert = require('assert');
const { runCouncil, getCouncilRun, distillPrompt, scoreAlignment } = require('../src/runtime/orchestrator');

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

  const record = await runCouncil({ prompt, mode: 'simulation' });
  assert.ok(record.requestId.startsWith('omos_run_'));
  assert.strictEqual(record.schemaVersion, '1.2.0');
  assert.strictEqual(record.mode, 'simulation');
  assert.strictEqual(record.currentStage, 6);
  assert.strictEqual(record.outputStatus, 'HUMAN_REVIEW_REQUIRED');
  assert.strictEqual(record.verificationStatus, 'not_factually_verified');
  assert.strictEqual(record.stages.length, 7);

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

  const stored = getCouncilRun(record.requestId);
  assert.ok(stored);
  assert.strictEqual(stored.requestId, record.requestId);

  console.log('OMOS workspace lifecycle tests passed.');
}

run().catch((error) => {
  console.error('Workspace lifecycle failure:', error);
  process.exit(1);
});