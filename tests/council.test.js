const assert = require('assert');
const { runCouncil } = require('../src/runtime/council');
const { deriveVerificationState } = require('../src/runtime/verification');

(async () => {
  const emptyProviderResult = await runCouncil({ question: 'Test question', providers: [] });
  assert.equal(emptyProviderResult.status, 'insufficient_providers');
  assert.equal(emptyProviderResult.verificationStatus, 'not_verified');
  assert.equal(emptyProviderResult.humanReviewRequired, true);

  const reviewOnly = deriveVerificationState({ evidenceChecked: false, providerCount: 4 });
  assert.equal(reviewOnly.verified, false);
  assert.equal(reviewOnly.verificationStatus, 'model_review_only');
  assert.equal(reviewOnly.factualVerification, 'not_performed');

  const approved = deriveVerificationState({ evidenceChecked: true, providerCount: 4, humanApproved: true });
  assert.equal(approved.verified, true);
  assert.equal(approved.verificationStatus, 'human_approved');

  console.log('Council runtime tests passed');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
