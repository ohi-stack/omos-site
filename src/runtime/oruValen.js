const crypto = require('crypto');

const ORU_VERSION = process.env.ORU_VALEN_VERSION || '0.2.0';
const ORU_CONTEXT_VERSION = '1.1.0';
const MEMORY_CLASSES = [
  'institutional_memory',
  'lived_experience',
  'decision_memory',
  'current_state',
  'outcome_learning'
];

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
  memoryClasses: MEMORY_CLASSES,
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

function normalizeMemoryClass(value) {
  const normalized = cleanString(value, 60).toLowerCase().replace(/\s+/g, '_');
  return MEMORY_CLASSES.includes(normalized) ? normalized : null;
}

function normalizeConfidence(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.min(1, number)) : null;
}

function normalizeSource(value = {}) {
  const source = value && typeof value === 'object' ? value : {};
  return {
    ref: cleanString(source.ref || source.id, 1000) || null,
    uri: cleanString(source.uri, 1000) || null,
    status: 'caller_supplied_unverified',
    observedAtUtc: cleanString(source.observedAtUtc, 80) || null
  };
}

function normalizeMemoryItem(value, index, defaults = {}) {
  const item = typeof value === 'string' ? { content: value } : (value || {});
  const content = cleanString(item.content || item.text || item.value, 4000);
  if (!content) return null;
  return {
    id: cleanString(item.id, 160) || `oru_item_${index + 1}`,
    memoryClass: normalizeMemoryClass(item.memoryClass || defaults.memoryClass) || 'current_state',
    epistemicClass: normalizeEpistemicClass(item.epistemicClass || defaults.epistemicClass),
    content,
    confidence: normalizeConfidence(item.confidence ?? defaults.confidence),
    source: normalizeSource(item.source || defaults.source),
    providerUse: item.providerUse === true
  };
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === 'object') {
    return Object.keys(value).sort().reduce((result, key) => {
      result[key] = stableValue(value[key]);
      return result;
    }, {});
  }
  return value;
}

function canonicalJson(value) {
  return JSON.stringify(stableValue(value));
}

function hashCanonical(value) {
  return `sha256:${crypto.createHash('sha256').update(canonicalJson(value)).digest('hex')}`;
}

function legacyItems(input, defaults, offset = 0) {
  const mappings = [
    ['currentPriorities', 'current_state'],
    ['currentConstraints', 'current_state'],
    ['relevantDecisions', 'decision_memory'],
    ['relevantOutcomes', 'outcome_learning']
  ];
  const items = [];
  for (const [key, memoryClass] of mappings) {
    for (const content of normalizeArray(input[key])) {
      const sourceRef = defaults.sourceRefs?.[items.length] || defaults.sourceRefs?.[0] || null;
      const normalized = normalizeMemoryItem(
        { content },
        offset + items.length,
        { ...defaults, memoryClass, source: { ...defaults.source, ref: sourceRef } }
      );
      if (normalized) items.push(normalized);
    }
  }
  return items;
}

function buildProviderProjection(snapshot) {
  const items = snapshot.items
    .filter((item) => item.providerUse)
    .map(({ providerUse, ...item }) => item);
  return {
    contextVersion: snapshot.contextVersion,
    origin: snapshot.origin,
    subject: snapshot.subject,
    disclosure: items.length ? 'explicit_items' : 'none',
    items
  };
}

function getOruValenPublicProfile() {
  return JSON.parse(JSON.stringify(PUBLIC_PROFILE));
}

function buildOruValenContext(input = {}) {
  const now = new Date().toISOString();
  const epistemicClass = normalizeEpistemicClass(input.epistemicClass);
  const defaults = {
    epistemicClass,
    confidence: input.confidence,
    source: { status: 'caller_supplied_unverified' },
    sourceRefs: normalizeArray(input.sourceRefs)
  };
  const explicitItems = Array.isArray(input.items)
    ? input.items.slice(0, 50).map((item, index) => normalizeMemoryItem(item, index, defaults)).filter(Boolean)
    : [];
  const items = [...explicitItems, ...legacyItems(input, defaults, explicitItems.length)].slice(0, 50);
  const notes = cleanString(input.notes, 4000);
  if (notes) {
    const note = normalizeMemoryItem({ content: notes }, items.length, { ...defaults, memoryClass: 'current_state' });
    if (note && items.length < 50) items.push(note);
  }
  const status = items.length ? 'attached' : 'absent';
  const snapshot = {
    contextVersion: ORU_CONTEXT_VERSION,
    origin: status === 'attached' ? 'caller_supplied_unverified' : 'absent',
    subject: cleanString(input.subject, 500) || 'current_request',
    items
  };
  const providerProjection = buildProviderProjection(snapshot);

  return {
    profile: getOruValenPublicProfile(),
    status,
    capturedAtUtc: now,
    snapshot,
    snapshotHash: hashCanonical(snapshot),
    providerProjection,
    providerProjectionHash: hashCanonical(providerProjection),
    boundaries: {
      inferenceIsNotFact: true,
      predictionIsNotAuthority: true,
      generatedTextIsNotAuthorityByDefault: true,
      materialActionRequiresAuthorization: true,
      financialLegalOwnershipActionsRequireExplicitHumanApproval: true,
      providerDisclosureRequiresExplicitItemPermission: true
    },
    capabilities: {
      callerSuppliedContextSnapshot: true,
      approvedSourceRetrieval: false,
      accHandoff: false,
      outcomeIngestion: false,
      digitalTwinLoopComplete: false
    }
  };
}

function verifyOruValenContext(record = {}) {
  if (!record.snapshot || !record.providerProjection) return false;
  return record.snapshotHash === hashCanonical(record.snapshot)
    && record.providerProjectionHash === hashCanonical(record.providerProjection);
}

module.exports = {
  ORU_VERSION,
  getOruValenPublicProfile,
  buildOruValenContext,
  buildProviderProjection,
  hashCanonical,
  verifyOruValenContext,
  normalizeEpistemicClass,
  normalizeMemoryClass
};
