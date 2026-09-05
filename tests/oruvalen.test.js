const assert = require('assert');
const {
  getOruValenPublicProfile,
  buildOruValenContext,
  verifyOruValenContext
} = require('../src/runtime/oruValen');
const { OMOSProcess } = require('../src/runtime/omos');

function run() {
  const profile = getOruValenPublicProfile();
  assert.equal(profile.id, 'oruvalen');
  assert.equal(profile.omosRelationship.runtime, 'OMOS');
  assert.equal(profile.omosRelationship.executionControlPlane, 'ACC');
  assert.equal(profile.mayOverrideHumanAuthority, false);
  assert.ok(profile.memoryClasses.includes('lived_experience'));
  assert.ok(profile.epistemicClasses.includes('inference'));

  const context = buildOruValenContext({
    subject: 'reference run',
    items: [
      {
        id: 'priority_1',
        memoryClass: 'current_state',
        epistemicClass: 'inference',
        confidence: 0.8,
        content: 'durable decision records',
        source: { ref: 'manual:test', status: 'caller_supplied_unverified' },
        providerUse: true
      },
      {
        id: 'private_1',
        memoryClass: 'lived_experience',
        content: 'private context',
        providerUse: false
      }
    ]
  });
  assert.equal(context.status, 'attached');
  assert.equal(context.snapshot.contextVersion, '1.1.0');
  assert.equal(context.snapshot.subject, 'reference run');
  assert.equal(context.snapshot.items[0].epistemicClass, 'inference');
  assert.equal(context.snapshot.items[0].confidence, 0.8);
  assert.equal(context.providerProjection.items.length, 1);
  assert.equal(context.providerProjection.items[0].id, 'priority_1');
  assert.ok(!JSON.stringify(context.providerProjection).includes('private context'));
  assert.equal(verifyOruValenContext(context), true);
  assert.equal(context.boundaries.inferenceIsNotFact, true);

  const callerClaimedApproved = buildOruValenContext({
    items: [{ memoryClass: 'institutional_memory', content: 'claim', source: { status: 'approved' } }]
  });
  assert.equal(callerClaimedApproved.snapshot.items[0].source.status, 'caller_supplied_unverified');

  const sameContext = buildOruValenContext({
    subject: 'reference run',
    items: [
      {
        id: 'priority_1', memoryClass: 'current_state', epistemicClass: 'inference',
        confidence: 0.8, content: 'durable decision records',
        source: { ref: 'manual:test', status: 'caller_supplied_unverified' }, providerUse: true
      },
      { id: 'private_1', memoryClass: 'lived_experience', content: 'private context', providerUse: false }
    ]
  });
  assert.equal(sameContext.snapshotHash, context.snapshotHash);
  assert.equal(sameContext.providerProjectionHash, context.providerProjectionHash);

  const absent = buildOruValenContext({});
  assert.equal(absent.status, 'absent');
  assert.equal(absent.snapshot.origin, 'absent');
  assert.equal(absent.providerProjection.items.length, 0);

  const result = OMOSProcess({
    input: 'Evaluate the next OMOS engineering milestone.',
    context: { oruValen: { subject: 'OMOS engineering', epistemicClass: 'stated_position' } }
  });
  assert.equal(result.intelligenceIdentity, 'oruvalen');
  assert.equal(result.observed.oruContextAttached, false);
  assert.equal(result.observed.oruContextStatus, 'absent');
  assert.equal(result.oruValen.profile.humanReviewRequiredForMaterialAction, true);
  assert.equal(result.outputStatus, 'HUMAN_REVIEW_REQUIRED');

  console.log('OruValen ↔ OMOS integration contract tests passed.');
}

run();
