function deriveVerificationState({ evidenceChecked = false, providerCount = 0, humanApproved = false } = {}) {
  if (!evidenceChecked) {
    return {
      verified: false,
      verificationStatus: 'model_review_only',
      factualVerification: 'not_performed',
      humanReviewRequired: true,
      providerCount
    };
  }

  return {
    verified: Boolean(humanApproved),
    verificationStatus: humanApproved ? 'human_approved' : 'evidence_checked_review_required',
    factualVerification: 'performed',
    humanReviewRequired: !humanApproved,
    providerCount
  };
}

module.exports = { deriveVerificationState };
