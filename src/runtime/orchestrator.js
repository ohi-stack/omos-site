const crypto = require('crypto');

const PROVIDERS = ['openai', 'anthropic', 'gemini', 'xai'];

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

function simulatedProvider(name, prompt) {
  const role = {
    openai: 'structure and implementation',
    anthropic: 'institutional and ethical review',
    gemini: 'patterns and system relationships',
    xai: 'edge cases and alternative framing'
  }[name];

  return normalizeProviderResult(name, {
    model: `simulation-${name}`,
    output: `[SIMULATION] ${name} reviews the prompt through ${role}: ${prompt.slice(0, 320)}`,
    simulated: true
  });
}

async function runAdapter(name, prompt, context = {}) {
  // Live provider calls intentionally remain behind adapter modules and environment configuration.
  // Until an adapter is configured, the orchestrator returns an explicit simulation result.
  try {
    const adapter = require(`../adapters/${name}`);
    if (adapter && typeof adapter.isConfigured === 'function' && adapter.isConfigured()) {
      return normalizeProviderResult(name, await adapter.generate({ prompt, context }));
    }
  } catch (error) {
    // Missing adapter or provider dependency falls back to simulation without masquerading as live execution.
  }

  return simulatedProvider(name, prompt);
}

function extractSignals(outputs) {
  const usable = outputs.filter((item) => item.output);
  const tokens = usable.map((item) => new Set(item.output.toLowerCase().split(/\W+/).filter((x) => x.length > 5)));
  const counts = new Map();

  tokens.forEach((set) => set.forEach((token) => counts.set(token, (counts.get(token) || 0) + 1)));

  const agreementZones = [...counts.entries()]
    .filter(([, count]) => count >= Math.max(2, Math.ceil(usable.length / 2)))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([term, count]) => ({ term, models: count }));

  return {
    agreementZones,
    contradictions: [],
    missingIdeas: [],
    novelInsights: usable.map((item) => ({ provider: item.provider, excerpt: item.output.slice(0, 240) })),
    note: 'Contradiction and missing-idea extraction are schema placeholders until semantic review adapters are implemented.'
  };
}

async function runCouncil({ prompt, context = {}, providers = PROVIDERS, mode = 'auto' } = {}) {
  const canonicalPrompt = String(prompt || '').trim();
  if (!canonicalPrompt) throw new Error('prompt_required');

  const requestId = `omos_run_${Date.now()}`;
  const startedAt = new Date().toISOString();
  const selectedProviders = providers.filter((name) => PROVIDERS.includes(name));
  const outputs = [];

  for (const name of selectedProviders) {
    if (mode === 'simulation') outputs.push(simulatedProvider(name, canonicalPrompt));
    else outputs.push(await runAdapter(name, canonicalPrompt, context));
  }

  const signals = extractSignals(outputs);
  const liveProviders = outputs.filter((item) => !item.simulated).map((item) => item.provider);
  const simulationProviders = outputs.filter((item) => item.simulated).map((item) => item.provider);

  const record = {
    requestId,
    schemaVersion: '1.0.0',
    runtimeVersion: process.env.OMOS_VERSION || '1.0.1',
    mode: liveProviders.length && simulationProviders.length ? 'hybrid' : liveProviders.length ? 'live' : 'simulation',
    canonicalPrompt,
    inputHash: hash(canonicalPrompt),
    providersRequested: selectedProviders,
    liveProviders,
    simulationProviders,
    round1: outputs,
    crossModelReview: signals,
    humanReviewRequired: true,
    verificationStatus: 'partial',
    outputStatus: 'HUMAN_REVIEW_REQUIRED',
    startedAt,
    completedAt: new Date().toISOString()
  };

  record.outputHash = hash(record);
  return record;
}

module.exports = { runCouncil, PROVIDERS };
