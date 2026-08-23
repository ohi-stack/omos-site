const crypto = require('crypto');

const PROVIDERS = ['openai', 'anthropic', 'gemini', 'xai'];
const RUN_STORE = new Map();
const MAX_RUNS = 200;

function hash(value) {
  return `sha256:${crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')}`;
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
  try {
    return require(`../adapters/${name}`);
  } catch (error) {
    return null;
  }
}

async function runAdapter(name, prompt, context = {}, phase = 'round1') {
  const adapter = loadAdapter(name);
  if (adapter && typeof adapter.isConfigured === 'function' && adapter.isConfigured()) {
    try {
      return normalizeProviderResult(name, await adapter.generate({
        prompt,
        context: { ...context, omosPhase: phase }
      }));
    } catch (error) {
      return normalizeProviderResult(name, {
        model: null,
        output: '',
        simulated: true,
        metadata: {
          phase,
          adapterError: error.message,
          fallback: 'simulation'
        }
      });
    }
  }
  return simulatedProvider(name, prompt, phase);
}

function sharedTokenSignals(outputs) {
  const usable = outputs.filter((item) => item.output);
  const tokens = usable.map((item) => new Set(item.output.toLowerCase().split(/\W+/).filter((x) => x.length > 5)));
  const counts = new Map();
  tokens.forEach((set) => set.forEach((token) => counts.set(token, (counts.get(token) || 0) + 1)));

  return [...counts.entries()]
    .filter(([, count]) => count >= Math.max(2, Math.ceil(usable.length / 2)))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([term, count]) => ({ term, models: count }));
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
      const result = mode === 'simulation'
        ? simulatedProvider(reviewer.provider, prompt, 'review')
        : await runAdapter(reviewer.provider, prompt, context, 'review');
      reviews.push({
        reviewer: reviewer.provider,
        subject: subject.provider,
        model: result.model,
        simulated: result.simulated,
        output: result.output,
        metadata: result.metadata
      });
    }
  }
  return reviews;
}

function extractSignals(outputs, reviews) {
  const agreementZones = sharedTokenSignals(outputs);
  const reviewText = reviews.map((item) => item.output).join('\n').toLowerCase();
  const contradictions = reviews
    .filter((item) => /contradiction|conflict|disagree|unsupported|inconsistent/.test(item.output.toLowerCase()))
    .slice(0, 20)
    .map((item) => ({ reviewer: item.reviewer, subject: item.subject, excerpt: item.output.slice(0, 300) }));
  const missingIdeas = reviews
    .filter((item) => /missing|evidence|uncertain|unknown|insufficient/.test(item.output.toLowerCase()))
    .slice(0, 20)
    .map((item) => ({ reviewer: item.reviewer, subject: item.subject, excerpt: item.output.slice(0, 300) }));
  const novelInsights = outputs.map((item) => ({ provider: item.provider, excerpt: item.output.slice(0, 300) }));

  return {
    agreementZones,
    contradictions,
    missingIdeas,
    novelInsights,
    modelAgreementStatus: agreementZones.length ? 'observed' : 'limited',
    evidenceSupportStatus: reviewText.includes('evidence') ? 'requires_source_validation' : 'not_evaluated',
    factualVerification: 'not_established_by_model_agreement',
    humanSynthesisRequired: true
  };
}

function persistRun(record) {
  RUN_STORE.set(record.requestId, record);
  while (RUN_STORE.size > MAX_RUNS) {
    const oldest = RUN_STORE.keys().next().value;
    RUN_STORE.delete(oldest);
  }
}

function getCouncilRun(requestId) {
  return RUN_STORE.get(requestId) || null;
}

function listCouncilRuns(limit = 20) {
  return [...RUN_STORE.values()]
    .slice(-Math.max(1, Math.min(Number(limit) || 20, 100)))
    .reverse()
    .map((record) => ({
      requestId: record.requestId,
      mode: record.mode,
      outputStatus: record.outputStatus,
      verificationStatus: record.verificationStatus,
      startedAt: record.startedAt,
      completedAt: record.completedAt,
      liveProviders: record.liveProviders,
      simulationProviders: record.simulationProviders
    }));
}

async function runCouncil({ prompt, context = {}, providers = PROVIDERS, mode = 'auto' } = {}) {
  const canonicalPrompt = String(prompt || '').trim();
  if (!canonicalPrompt) throw new Error('prompt_required');

  const requestId = `omos_run_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  const startedAt = new Date().toISOString();
  const selectedProviders = providers.filter((name) => PROVIDERS.includes(name));
  if (!selectedProviders.length) throw new Error('provider_required');

  const outputs = await Promise.all(selectedProviders.map(async (name) => {
    if (mode === 'simulation') return simulatedProvider(name, canonicalPrompt, 'round1');
    return runAdapter(name, canonicalPrompt, context, 'round1');
  }));

  const liveProviders = outputs.filter((item) => !item.simulated).map((item) => item.provider);
  const simulationProviders = outputs.filter((item) => item.simulated).map((item) => item.provider);
  const actualMode = liveProviders.length && simulationProviders.length ? 'hybrid' : liveProviders.length ? 'live' : 'simulation';

  const crossModelReview = await runCrossReview(outputs, mode === 'simulation' ? 'simulation' : 'auto', {
    ...context,
    requestId,
    canonicalPrompt
  });

  const signals = extractSignals(outputs, crossModelReview);

  const record = {
    requestId,
    schemaVersion: '1.1.0',
    runtimeVersion: process.env.OMOS_VERSION || '1.1.0',
    mode: actualMode,
    canonicalPrompt,
    inputHash: hash(canonicalPrompt),
    providersRequested: selectedProviders,
    liveProviders,
    simulationProviders,
    pipeline: [
      'receive',
      'normalize',
      'round1_independent_outputs',
      'cross_model_review',
      'agreement_conflict_mapping',
      'human_synthesis',
      'verification'
    ],
    round1: outputs,
    crossModelReview,
    signals,
    humanSynthesis: {
      required: true,
      status: 'pending',
      instruction: 'Review agreement zones, contradictions, missing evidence, and novel insights before approving a governed OHI output.'
    },
    humanReviewRequired: true,
    verificationStatus: 'partial',
    outputStatus: 'HUMAN_REVIEW_REQUIRED',
    startedAt,
    completedAt: new Date().toISOString()
  };

  record.outputHash = hash({
    requestId,
    canonicalPrompt,
    round1: outputs,
    crossModelReview,
    signals
  });
  persistRun(record);
  return record;
}

module.exports = { runCouncil, getCouncilRun, listCouncilRuns, PROVIDERS };
