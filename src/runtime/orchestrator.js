const crypto = require('crypto');
const {
  saveRecord,
  getRecord,
  listRecords,
  summary,
  getPersistenceStatus,
  verifyAuditChain
} = require('./decisionStore');

const PROVIDERS = ['openai', 'anthropic', 'gemini', 'xai'];

function hash(value) {
  return `sha256:${crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')}`;
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function splitSentences(text) {
  return String(text || '').split(/(?<=[.!?])\s+|\n+/).map(normalizeText).filter(Boolean);
}

function distillPrompt(prompt, context = {}) {
  const raw = String(prompt || '').trim();
  const units = splitSentences(raw);
  const questions = units.filter((x) => /\?$/.test(x));
  const constraints = units.filter((x) => /\b(must|should|need|require|cannot|can't|do not|don't|limit|deadline|budget|only|before|after)\b/i.test(x));
  const evidence = units.filter((x) => /\b(source|evidence|record|document|data|report|according to|verified|citation)\b/i.test(x));
  const ambiguities = units.filter((x) => /\b(maybe|possibly|unclear|unknown|approximately|around|might|could)\b/i.test(x));
  const quarantined = units.filter((x) => /\b(ignore (all|every|previous)|bypass|delete logs|reveal chain of thought|100% verified|guarantee)\b/i.test(x));
  const preserved = units.filter((x) => !quarantined.includes(x));
  const canonicalInput = normalizeText(preserved.join(' '));
  const objective = questions[0] || preserved[0] || canonicalInput;

  return {
    status: canonicalInput ? 'COMPLETE' : 'FAILED',
    objective,
    meaningUnits: units.map((text, index) => ({ id: `mu_${index + 1}`, text })),
    questions,
    constraints,
    evidence,
    ambiguities,
    quarantined,
    canonicalInput,
    contextKeys: Object.keys(context || {}),
    materialPreserved: true,
    method: 'deterministic_signal_classification_v1'
  };
}

function scoreAlignment(layer1) {
  const text = layer1.canonicalInput.toLowerCase();
  const clamp = (n) => Math.max(0, Math.min(1, Number(n.toFixed(2))));
  const has = (pattern) => pattern.test(text);
  const evidence = layer1.evidence.length ? 0.78 : 0.42;
  const clarity = clamp(0.62 + Math.min(layer1.constraints.length * 0.04, 0.16) - Math.min(layer1.ambiguities.length * 0.03, 0.15));
  const truth = clamp(evidence + (has(/verify|evidence|source|record/) ? 0.08 : 0));
  const coherence = clamp(0.7 - Math.min(layer1.ambiguities.length * 0.025, 0.12));
  const dignity = has(/dehuman|coerc|manipulat/) ? 0.45 : 0.9;
  const constructiveUnity = has(/needless conflict|division|fragment/) ? 0.55 : 0.82;
  const verifiability = clamp(evidence + (has(/verify|source|record|data/) ? 0.1 : 0));
  const executionReadiness = clamp(0.55 + Math.min(layer1.constraints.length * 0.04, 0.16) - Math.min(layer1.ambiguities.length * 0.04, 0.2));
  const confidence = clamp((truth + clarity + coherence + verifiability) / 4);
  const hardGates = [];
  if (layer1.quarantined.length) hardGates.push({ gate: 'instruction_integrity', status: 'REVIEW', reason: 'Quarantined instructions detected.' });
  if (dignity < 0.6) hardGates.push({ gate: 'dignity', status: 'BLOCK', reason: 'Potential coercive or manipulative framing detected.' });
  if (truth < 0.55) hardGates.push({ gate: 'evidence', status: 'REVIEW', reason: 'Evidence support is incomplete.' });

  const dimensions = { truth, clarity, coherence, dignity, constructiveUnity, evidence, verifiability, executionReadiness, confidence };
  const overallScore = clamp(Object.values(dimensions).reduce((a, b) => a + b, 0) / Object.values(dimensions).length);
  const blocked = hardGates.some((g) => g.status === 'BLOCK');
  const needsReview = hardGates.length || confidence < 0.7;

  return {
    status: 'COMPLETE',
    dimensions,
    hardGates,
    overallScore,
    state: blocked ? 'PROHIBITED' : needsReview ? 'HUMAN_REVIEW_REQUIRED' : 'CONDITIONALLY_ALIGNED',
    scoringProfile: 'omos_alignment_functional_v1',
    note: 'Heuristic Functional-stage scoring. Scores are decision-support signals, not factual verification.'
  };
}

function normalizeProviderResult(name, result) {
  return {
    provider: name,
    model: result.model || null,
    output: String(result.output || result.text || '').trim(),
    latencyMs: result.latencyMs || null,
    simulated: Boolean(result.simulated),
    metadata: result.metadata || {}
  };
}

function simulatedProvider(name, prompt, phase = 'round1') {
  const role = {
    openai: 'structure, implementation, and decomposition',
    anthropic: 'institutional, ethical, and edge-case review',
    gemini: 'patterns, dependencies, and system relationships',
    xai: 'counterpoints, weak assumptions, and direct alternatives'
  }[name];
  const prefix = phase === 'review'
    ? `[SIMULATION REVIEW] ${name} performs cross-model review through ${role}`
    : `[SIMULATION] ${name} reviews the prompt through ${role}`;
  return normalizeProviderResult(name, {
    model: `simulation-${name}`,
    output: `${prefix}: ${String(prompt).slice(0, 1200)}`,
    simulated: true,
    metadata: { phase }
  });
}

function loadAdapter(name) {
  try { return require(`../adapters/${name}`); } catch (error) { return null; }
}

async function runAdapter(name, prompt, context = {}, phase = 'round1') {
  const adapter = loadAdapter(name);
  if (adapter && typeof adapter.isConfigured === 'function' && adapter.isConfigured()) {
    try {
      return normalizeProviderResult(name, await adapter.generate({ prompt, context: { ...context, omosPhase: phase } }));
    } catch (error) {
      return normalizeProviderResult(name, { model: null, output: '', simulated: true, metadata: { phase, adapterError: error.message, fallback: 'simulation' } });
    }
  }
  return simulatedProvider(name, prompt, phase);
}

function sharedTokenSignals(outputs) {
  const usable = outputs.filter((item) => item.output);
  const tokens = usable.map((item) => new Set(item.output.toLowerCase().split(/\W+/).filter((x) => x.length > 5)));
  const counts = new Map();
  tokens.forEach((set) => set.forEach((token) => counts.set(token, (counts.get(token) || 0) + 1)));
  return [...counts.entries()].filter(([, count]) => count >= Math.max(2, Math.ceil(usable.length / 2))).sort((a, b) => b[1] - a[1]).slice(0, 30).map(([term, count]) => ({ term, models: count }));
}

function buildReviewPrompt(reviewer, subject, allOutputs) {
  const context = allOutputs.map((item) => `MODEL: ${item.provider}\n${item.output}`).join('\n\n---\n\n');
  return `You are ${reviewer} in the OMOS Cross-Model Review Cycle. Review ${subject.provider}'s independent output against the other model outputs below. Return concise sections named: AGREEMENTS, CONTRADICTIONS, MISSING_EVIDENCE, NOVEL_INSIGHTS, RISKS. Do not treat model agreement as factual proof. Preserve meaningful dissent and explicitly mark uncertainty.\n\nSUBJECT OUTPUT:\n${subject.output}\n\nALL ROUND 1 OUTPUTS:\n${context}`;
}

async function runCrossReview(outputs, mode, context) {
  const reviews = [];
  for (const reviewer of outputs) {
    for (const subject of outputs) {
      if (reviewer.provider === subject.provider) continue;
      const prompt = buildReviewPrompt(reviewer.provider, subject, outputs);
      const result = mode === 'simulation' ? simulatedProvider(reviewer.provider, prompt, 'review') : await runAdapter(reviewer.provider, prompt, context, 'review');
      reviews.push({ reviewer: reviewer.provider, subject: subject.provider, model: result.model, simulated: result.simulated, output: result.output, metadata: result.metadata });
    }
  }
  return reviews;
}

function extractSignals(outputs, reviews) {
  const agreementZones = sharedTokenSignals(outputs);
  const reviewText = reviews.map((item) => item.output).join('\n').toLowerCase();
  const contradictions = reviews.filter((item) => /contradiction|conflict|disagree|unsupported|inconsistent/.test(item.output.toLowerCase())).slice(0, 20).map((item) => ({ reviewer: item.reviewer, subject: item.subject, excerpt: item.output.slice(0, 300) }));
  const missingIdeas = reviews.filter((item) => /missing|evidence|uncertain|unknown|insufficient/.test(item.output.toLowerCase())).slice(0, 20).map((item) => ({ reviewer: item.reviewer, subject: item.subject, excerpt: item.output.slice(0, 300) }));
  const novelInsights = outputs.map((item) => ({ provider: item.provider, excerpt: item.output.slice(0, 300) }));
  return { agreementZones, contradictions, missingIdeas, novelInsights, modelAgreementStatus: agreementZones.length ? 'observed' : 'limited', evidenceSupportStatus: reviewText.includes('evidence') ? 'requires_source_validation' : 'not_evaluated', factualVerification: 'not_established_by_model_agreement', humanSynthesisRequired: true };
}

function buildGovernedSynthesis(layer1, alignment, signals, outputs) {
  return {
    status: 'COMPLETE',
    objective: layer1.objective,
    summary: `OMOS processed ${outputs.length} independent model output(s), ${signals.contradictions.length} contradiction signal(s), and ${signals.missingIdeas.length} missing-evidence signal(s).`,
    agreementZones: signals.agreementZones,
    contradictions: signals.contradictions,
    missingEvidence: signals.missingIdeas,
    novelInsights: signals.novelInsights,
    alignmentState: alignment.state,
    verificationState: 'NOT_FACTUALLY_VERIFIED',
    recommendation: alignment.state === 'PROHIBITED' ? 'Do not proceed without resolving blocked gates.' : 'Human review is required before accepting this governed output.',
    humanApprovalRequired: true
  };
}

function requireOwnerId(ownerId) {
  const current = require('./keys').getCurrentOwner();
  const value = String(ownerId || current?.ownerId || '').trim();
  if (!value) throw new Error('owner_required');
  return value;
}

function assertHumanGateTransition(record) {
  if (record.currentStage !== 6) throw new Error('invalid_stage_transition');
  const humanStage = record.stages.find((stage) => stage.id === 6);
  const recordStage = record.stages.find((stage) => stage.id === 7);
  if (!humanStage || humanStage.status !== 'NEEDS_REVIEW' || !recordStage || recordStage.status !== 'PENDING') {
    throw new Error('invalid_stage_transition');
  }
  for (const stage of record.stages.filter((stage) => stage.id < 6)) {
    if (stage.status !== 'COMPLETE') throw new Error('invalid_stage_transition');
  }
}

async function getCouncilRun(requestId, ownerId) {
  return getRecord(requestId, requireOwnerId(ownerId));
}

async function listCouncilRuns(limit = 20, ownerId) {
  const records = await listRecords(limit, requireOwnerId(ownerId));
  return records.map(summary);
}

async function setHumanDecision(requestId, decision, comment = '', reviewer = null, ownerId) {
  const owner = requireOwnerId(ownerId);
  const record = await getRecord(requestId, owner);
  if (!record) return null;
  const normalized = String(decision || '').toUpperCase();
  if (!['APPROVED', 'REJECTED'].includes(normalized)) throw new Error('invalid_human_decision');
  assertHumanGateTransition(record);

  const decidedAt = new Date().toISOString();
  record.humanGate = {
    decision: normalized,
    comment: String(comment || '').slice(0, 2000),
    reviewer: reviewer || owner,
    decidedAt,
    persistence: getPersistenceStatus().durable ? 'durable_database' : 'memory_fallback'
  };
  record.currentStage = 7;
  record.stages = record.stages.map((stage) => {
    if (stage.id === 6) return { ...stage, status: 'COMPLETE', result: normalized, completedAt: decidedAt };
    if (stage.id === 7) return { ...stage, status: 'COMPLETE', completedAt: decidedAt };
    return stage;
  });
  record.outputStatus = normalized;
  record.completedAt = decidedAt;
  record.persistence = getPersistenceStatus();
  await saveRecord(record, owner);
  return record;
}

async function runCouncil({ prompt, context = {}, providers = PROVIDERS, mode = 'auto', owner } = {}) {
  const rawPrompt = String(prompt || '').trim();
  if (!rawPrompt) throw new Error('prompt_required');
  const current = require('./keys').getCurrentOwner();
  const ownerId = requireOwnerId(owner?.ownerId || owner);
  const requestId = `omos_run_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  const startedAt = new Date().toISOString();
  const selectedProviders = providers.filter((name) => PROVIDERS.includes(name));
  if (!selectedProviders.length) throw new Error('provider_required');

  const stages = [
    { id: 1, key: 'ask', label: 'Ask OMOS', status: 'COMPLETE', startedAt },
    { id: 2, key: 'layer1', label: 'Layer 1', status: 'RUNNING' },
    { id: 3, key: 'alignment', label: 'Alignment', status: 'PENDING' },
    { id: 4, key: 'council', label: 'Council Review', status: 'PENDING' },
    { id: 5, key: 'synthesis', label: 'Governed Synthesis', status: 'PENDING' },
    { id: 6, key: 'human_gate', label: 'Human Gate', status: 'PENDING' },
    { id: 7, key: 'record', label: 'Decision Record', status: 'PENDING' }
  ];

  const layer1 = distillPrompt(rawPrompt, context);
  stages[1] = { ...stages[1], status: 'COMPLETE', completedAt: new Date().toISOString() };
  stages[2] = { ...stages[2], status: 'RUNNING' };
  const alignment = scoreAlignment(layer1);
  stages[2] = { ...stages[2], status: 'COMPLETE', completedAt: new Date().toISOString() };
  stages[3] = { ...stages[3], status: 'RUNNING' };

  const outputs = await Promise.all(selectedProviders.map(async (name) => mode === 'simulation' ? simulatedProvider(name, layer1.canonicalInput, 'round1') : runAdapter(name, layer1.canonicalInput, context, 'round1')));
  const liveProviders = outputs.filter((item) => !item.simulated).map((item) => item.provider);
  const simulationProviders = outputs.filter((item) => item.simulated).map((item) => item.provider);
  const actualMode = liveProviders.length && simulationProviders.length ? 'hybrid' : liveProviders.length ? 'live' : 'simulation';
  const crossModelReview = await runCrossReview(outputs, mode === 'simulation' ? 'simulation' : 'auto', { ...context, requestId, canonicalPrompt: layer1.canonicalInput });
  const signals = extractSignals(outputs, crossModelReview);
  stages[3] = { ...stages[3], status: 'COMPLETE', completedAt: new Date().toISOString() };
  stages[4] = { ...stages[4], status: 'RUNNING' };
  const governedOutput = buildGovernedSynthesis(layer1, alignment, signals, outputs);
  stages[4] = { ...stages[4], status: 'COMPLETE', completedAt: new Date().toISOString() };
  stages[5] = { ...stages[5], status: 'NEEDS_REVIEW' };

  const record = {
    requestId,
    ownerId,
    ownerLabel: owner?.name || current?.name || null,
    schemaVersion: '1.4.0',
    runtimeVersion: process.env.OMOS_VERSION || '1.1.0',
    mode: actualMode,
    rawPrompt,
    canonicalPrompt: layer1.canonicalInput,
    inputHash: hash(rawPrompt),
    providersRequested: selectedProviders,
    liveProviders,
    simulationProviders,
    currentStage: 6,
    stages,
    layer1,
    alignment,
    round1: outputs,
    crossModelReview,
    signals,
    governedOutput,
    humanGate: { decision: null, comment: '', reviewer: null, decidedAt: null },
    humanReviewRequired: true,
    verificationStatus: 'not_factually_verified',
    outputStatus: 'HUMAN_REVIEW_REQUIRED',
    persistence: getPersistenceStatus(),
    startedAt,
    completedAt: new Date().toISOString()
  };
  record.outputHash = hash({ requestId, layer1, alignment, round1: outputs, crossModelReview, signals, governedOutput });
  await saveRecord(record, ownerId);
  record.persistence = getPersistenceStatus();
  return record;
}

async function verifyCouncilAuditChain(requestId, ownerId) {
  return verifyAuditChain(requestId, requireOwnerId(ownerId));
}

module.exports = {
  runCouncil,
  getCouncilRun,
  listCouncilRuns,
  setHumanDecision,
  verifyCouncilAuditChain,
  distillPrompt,
  scoreAlignment,
  getPersistenceStatus,
  PROVIDERS
};
