const ORU_VERSION = process.env.ORU_VALEN_VERSION || '0.1.0';

const PUBLIC_PROFILE = Object.freeze({
  id: 'oruvalen',
  name: 'Oru’Valen™',
  version: ORU_VERSION,
  systemClass: 'OHI Twin / Operational Intelligence',
  status: 'integration_foundation',
  humanAuthority: 'One Gregory Onegodian™',
  purpose: 'Knowledge continuity, lived-experience learning, decision support, operational intelligence, workflow coordination, and authorized execution support.',
  mayRepresentItselfAsHumanAuthority: false,
  mayOverrideHumanAuthority: false,
  humanReviewRequiredForMaterialAction: true,
  omosRelationship: {
    role: 'personalized intelligence and continuity layer',
    runtime: 'OMOS',
    executionControlPlane: 'ACC',
    flow: [
      'human_input',
      'oru_context',
      'omos_distill',
      'omos_alignment',
      'council_review',
      'governed_synthesis',
      'human_gate',
      'decision_record',
      'acc_authorized_execution',
      'outcome',
      'oru_learning'
    ]
  },
  memoryClasses: [
    'institutional_memory',
    'lived_experience',
    'decision_memory',
    'current_state',
    'outcome_learning'
  ],
  epistemicClasses: ['fact', 'stated_position', 'inference', 'prediction'],
  sourcePrinciples: [
    'preserve_identity',
    'respect_chronology',
    'separate_entities',
    'verify_claims',
    'separate_fact_from_inference',
    'protect_human_authority',
    'measure_outcomes',
    'execute_only_within_authorized_boundaries'
  ]
});

function cleanString(value, max = 4000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function normalizeArray(value, max = 20) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, max).map((item) => cleanString(String(item), 1000)).filter(Boolean);
}

function normalizeEpistemicClass(value) {
  const normalized = cleanString(value, 40).toLowerCase().replace(/\s+/g, '_');
  return PUBLIC_PROFILE.epistemicClasses.includes(normalized) ? normalized : null;
}

function getOruValenPublicProfile() {
  return JSON.parse(JSON.stringify(PUBLIC_PROFILE));
}

function buildOruValenContext(input = {}) {
  const now = new Date().toISOString();
  const epistemicClass = normalizeEpistemicClass(input.epistemicClass);

  return {
    profile: getOruValenPublicProfile(),
    session: {
      contextVersion: '1.0.0',
      generatedAtUtc: now,
      subject: cleanString(input.subject, 500) || 'current_request',
      epistemicClass: epistemicClass || 'stated_position',
      confidence: Number.isFinite(Number(input.confidence))
        ? Math.max(0, Math.min(1, Number(input.confidence)))
        : null,
      sourceRefs: normalizeArray(input.sourceRefs),
      currentPriorities: normalizeArray(input.currentPriorities),
      currentConstraints: normalizeArray(input.currentConstraints),
      relevantDecisions: normalizeArray(input.relevantDecisions),
      relevantOutcomes: normalizeArray(input.relevantOutcomes),
      notes: cleanString(input.notes, 4000) || null
    },
    boundaries: {
      inferenceIsNotFact: true,
      predictionIsNotAuthority: true,
      generatedTextIsNotAuthorityByDefault: true,
      materialActionRequiresAuthorization: true,
      financialLegalOwnershipActionsRequireExplicitHumanApproval: true
    }
  };
}

module.exports = {
  ORU_VERSION,
  getOruValenPublicProfile,
  buildOruValenContext,
  normalizeEpistemicClass
};
