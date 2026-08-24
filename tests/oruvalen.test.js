const assert = require('assert');
const { getOruValenPublicProfile, buildOruValenContext } = require('../src/runtime/oruValen');
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
    epistemicClass: 'inference',
    confidence: 0.8,
    currentPriorities: ['durable decision records']
  });
  assert.equal(context.session.subject, 'reference run');
  assert.equal(context.session.epistemicClass, 'inference');
  assert.equal(context.session.confidence, 0.8);
  assert.equal(context.boundaries.inferenceIsNotFact, true);

  const result = OMOSProcess({
    input: 'Evaluate the next OMOS engineering milestone.',
    context: { oruValen: { subject: 'OMOS engineering', epistemicClass: 'stated_position' } }
  });
  assert.equal(result.intelligenceIdentity, 'oruvalen');
  assert.equal(result.observed.oruContextAttached, true);
  assert.equal(result.oruValen.profile.humanReviewRequiredForMaterialAction, true);
  assert.equal(result.outputStatus, 'HUMAN_REVIEW_REQUIRED');

  console.log('OruValen ↔ OMOS integration contract tests passed.');
}

run();
