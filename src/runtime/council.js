const crypto = require('crypto');
const { getProviderRegistry } = require('./providers');

const COUNCIL_SYSTEM = `You are one independent reasoning member of the OMOS Council of Models. Produce a concise, evidence-aware answer. Distinguish facts, assumptions, uncertainty, and recommendations. Do not claim consensus, verification, or authority you do not have.`;

const REVIEW_SYSTEM = `You are performing cross-model peer review for OMOS. Review the other model outputs, not your own. Return concise sections named AGREEMENTS, CONTRADICTIONS, MISSING_IDEAS, NOVEL_INSIGHTS, and RISKS. Preserve meaningful dissent. Model agreement is not factual verification.`;

const SYNTHESIS_SYSTEM = `You are the OMOS synthesis coordinator. Synthesize independent outputs and cross-reviews. Preserve supported dissent and unresolved uncertainty. Return sections: GOVERNED_SYNTHESIS, AGREEMENT_ZONES, CONTRADICTIONS, MISSING_EVIDENCE, SUPPORTED_DISSENT, RECOMMENDED_NEXT_ACTION, CONFIDENCE. Never describe the result as verified truth merely because models agree.`;

function hash(value) {
  return `sha256:${crypto.createHash('sha256').update(String(value)).digest('hex')}`;
}

function normalizePrompt(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}

async function safeGenerate(provider, payload) {
  try {
    const output = await provider.generate(payload);
    return { provider: provider.id, model: provider.model, status: 'ok', output };
  } catch (error) {
    return { provider: provider.id, model: provider.model, status: 'error', output: '', error: error.message };
  }
}

async function runCouncil(payload = {}) {
  const question = normalizePrompt(payload.input || payload.prompt || payload.question || '');
  if (!question) throw new Error('A question or prompt is required');

  const registry = getProviderRegistry();
  const requested = Array.isArray(payload.providers) && payload.providers.length
    ? payload.providers
    : ['openai', 'anthropic', 'gemini', 'xai'];
  const providers = requested.map(id => registry[id]).filter(Boolean);
  const configured = providers.filter(p => p.configured);

  if (configured.length < 2) {
    return {
      mode: 'live',
      status: 'insufficient_providers',
      message: 'At least two configured model providers are required for a live Council run.',
      requestedProviders: requested,
      configuredProviders: configured.map(p => p.id),
      verificationStatus: 'not_verified',
      humanReviewRequired: true
    };
  }

  const round1 = await Promise.all(configured.map(provider => safeGenerate(provider, {
    system: COUNCIL_SYSTEM,
    prompt: question
  })));

  const successful = round1.filter(r => r.status === 'ok' && r.output);
  if (successful.length < 2) {
    return {
      mode: 'live', status: 'provider_failure', question, round1,
      verificationStatus: 'not_verified', humanReviewRequired: true
    };
  }

  const crossReviews = await Promise.all(successful.map(async reviewer => {
    const provider = registry[reviewer.provider];
    const peers = successful
      .filter(item => item.provider !== reviewer.provider)
      .map(item => `MODEL ${item.provider}/${item.model}:\n${item.output}`)
      .join('\n\n---\n\n');
    const review = await safeGenerate(provider, {
      system: REVIEW_SYSTEM,
      prompt: `ORIGINAL QUESTION:\n${question}\n\nOTHER MODEL OUTPUTS:\n${peers}`
    });
    return { reviewer: reviewer.provider, model: reviewer.model, ...review };
  }));

  const synthesisProvider = registry[payload.synthesisProvider] || registry.openai || configured[0];
  const synthesisInput = [
    `QUESTION:\n${question}`,
    `ROUND 1:\n${successful.map(x => `[${x.provider}] ${x.output}`).join('\n\n')}`,
    `CROSS REVIEWS:\n${crossReviews.filter(x => x.status === 'ok').map(x => `[${x.reviewer}] ${x.output}`).join('\n\n')}`
  ].join('\n\n=====\n\n');

  const synthesis = await safeGenerate(synthesisProvider, { system: SYNTHESIS_SYSTEM, prompt: synthesisInput });
  const runId = payload.requestId || `omos_council_${Date.now()}`;

  return {
    runId,
    mode: 'live',
    runtime: 'omos-council',
    version: '1.0.0-alpha',
    question,
    inputHash: hash(question),
    providers: successful.map(x => ({ id: x.provider, model: x.model })),
    round1,
    crossReviews,
    synthesis,
    verificationStatus: 'model_review_only',
    factualVerification: 'not_performed',
    humanReviewRequired: true,
    outputHash: hash(synthesis.output || ''),
    timestampUtc: new Date().toISOString()
  };
}

module.exports = { runCouncil };
