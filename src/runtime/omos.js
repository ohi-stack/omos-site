const crypto = require('crypto');

function normalizeText(value) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ');
}

function sha256(value) {
  return `sha256:${crypto.createHash('sha256').update(String(value || '')).digest('hex')}`;
}

const PIPELINE = ['observe', 'distill', 'align', 'select', 'execute', 'verify'];
const POSITIVE_DIMENSIONS = ['truth', 'clarity', 'coherence', 'dignity', 'constructive_unity', 'evidence', 'verifiability', 'transparency', 'reproducibility', 'security', 'long_term_benefit', 'execution_readiness'];
const NEGATIVE_DIMENSIONS = ['distortion', 'manipulation', 'fragmentation', 'needless_conflict', 'unsupported_claims', 'hidden_risk', 'coercion', 'unauthorized_action'];
const HARD_GATES = ['dignity', 'consent', 'authorization', 'fabricated_evidence', 'high_risk'];

function classifyInput(text) {
  const source = normalizeText(text);
  const lower = source.toLowerCase();
  const injections = ['ignore previous', 'ignore every', 'bypass', 'reveal chain of thought', 'delete logs'];
  const riskFlags = injections.filter((item) => lower.includes(item));
  return {
    canonicalInput: source,
    inputHash: sha256(source),
    hasInput: Boolean(source),
    riskFlags,
    status: riskFlags.length ? 'human_review_required' : 'validated'
  };
}

function scoreDimension(text, terms) {
  const lower = text.toLowerCase();
  let hits = 0;
  for (const term of terms) if (lower.includes(term)) hits += 1;
  return Math.min(1, Number((hits / Math.max(terms.length, 1)).toFixed(2)));
}

function evaluateOption(option, index) {
  const text = normalizeText(option.text || option.content || option.output || '');
  const lower = text.toLowerCase();

  const dimensionTerms = {
    truth: ['truth', 'accurate', 'fact', 'evidence'],
    clarity: ['clear', 'clarity', 'structured', 'concise'],
    coherence: ['coherent', 'consistent', 'logical'],
    dignity: ['dignity', 'agency', 'respect'],
    constructive_unity: ['unity', 'cooperation', 'constructive'],
    evidence: ['evidence', 'source', 'citation'],
    verifiability: ['verify', 'verifiable', 'check'],
    transparency: ['transparent', 'disclose', 'assumption'],
    reproducibility: ['repeatable', 'reproducible', 'deterministic'],
    security: ['secure', 'security', 'authorization'],
    long_term_benefit: ['long-term', 'sustainable', 'durable'],
    execution_readiness: ['ready', 'action', 'execute', 'implementation']
  };

  const scores = Object.fromEntries(Object.entries(dimensionTerms).map(([key, terms]) => [key, scoreDimension(text, terms)]));
  const penalties = {
    distortion: /mislead|fabricat|false/.test(lower) ? 1 : 0,
    manipulation: /manipulat|coerce/.test(lower) ? 1 : 0,
    fragmentation: /fragment|divide/.test(lower) ? 0.5 : 0,
    needless_conflict: /needless conflict|unnecessary conflict/.test(lower) ? 1 : 0,
    unsupported_claims: /unsupported|guarantee|100% verified/.test(lower) ? 1 : 0,
    hidden_risk: /hidden risk|conceal/.test(lower) ? 1 : 0,
    coercion: /coerc/.test(lower) ? 1 : 0,
    unauthorized_action: /unauthorized|bypass approval/.test(lower) ? 1 : 0
  };

  const positiveAverage = Object.values(scores).reduce((a, b) => a + b, 0) / POSITIVE_DIMENSIONS.length;
  const negativeAverage = Object.values(penalties).reduce((a, b) => a + b, 0) / NEGATIVE_DIMENSIONS.length;
  const overall = Math.max(0, Math.min(1, Number((positiveAverage - negativeAverage).toFixed(2))));

  const gates = {
    dignity: scores.dignity > 0 || !/dehuman|demean/.test(lower),
    consent: !/without consent|ignore consent/.test(lower),
    authorization: !/unauthorized|bypass approval/.test(lower),
    fabricated_evidence: !/fabricat|make up evidence/.test(lower),
    high_risk: !/high-risk autonomous execution/.test(lower)
  };
  const failedGates = HARD_GATES.filter((gate) => !gates[gate]);
  const status = failedGates.length
    ? 'prohibited'
    : overall >= 0.75
      ? 'aligned'
      : overall >= 0.5
        ? 'conditionally_aligned'
        : text
          ? 'human_review_required'
          : 'insufficient_evidence';

  return {
    index,
    label: option.label || option.model || `option_${index + 1}`,
    text,
    alignmentScores: scores,
    penalties,
    hardGates: gates,
    failedGates,
    overallAlignment: overall,
    confidence: text ? Math.min(0.95, Number((0.45 + overall / 2).toFixed(2))) : 0,
    status
  };
}

function OMOSProcess(payload = {}) {
  const requestId = payload.requestId || `omos_${Date.now()}`;
  const intake = classifyInput(payload.input || payload.prompt || payload.question || '');
  const options = Array.isArray(payload.options) ? payload.options : [];
  const evaluatedOptions = options.map(evaluateOption);
  const permitted = evaluatedOptions.filter((item) => item.status !== 'prohibited');
  const selected = permitted.length
    ? [...permitted].sort((a, b) => b.overallAlignment - a.overallAlignment)[0]
    : null;

  const contradictions = Array.isArray(payload.contradictions) ? payload.contradictions : [];
  const supportedDissent = Array.isArray(payload.supportedDissent) ? payload.supportedDissent : [];
  const evidenceRefs = Array.isArray(payload.evidenceRefs) ? payload.evidenceRefs : [];
  const output = selected ? selected.text : intake.canonicalInput || 'No usable input was provided for OMOS processing.';
  const humanApprovalRequired = Boolean(
    intake.riskFlags.length ||
    contradictions.length ||
    !selected ||
    selected.status !== 'aligned' ||
    payload.consequential === true
  );

  const verificationStatus = selected && selected.status === 'aligned' && !humanApprovalRequired
    ? 'eligible_for_reviewed_execution'
    : output
      ? 'informational_or_human_review'
      : 'failed';

  const record = {
    schemaVersion: '1.1.0',
    decisionId: requestId,
    runtime: 'omos-runtime',
    runtimeVersion: '1.1.0',
    algorithmVersion: payload.algorithmVersion || '1.1',
    rulesetVersion: payload.rulesetVersion || '2026.08',
    pipeline: PIPELINE,
    maturity: 'functional',
    humanOversight: true,
    intake,
    modelsUsed: evaluatedOptions.map((item) => item.label),
    evaluatedOptions,
    selected,
    contradictions,
    supportedDissent,
    evidenceRefs,
    humanApprovalRequired,
    verificationStatus,
    output,
    timestampUtc: new Date().toISOString()
  };

  return { ...record, outputHash: sha256(JSON.stringify(record)) };
}

module.exports = { OMOSProcess, classifyInput, evaluateOption, sha256, PIPELINE };
