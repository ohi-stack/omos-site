const crypto = require('crypto');

const COUNCIL_MODELS = ['openai', 'anthropic', 'gemini', 'xai'];

function hash(value) {
  return `sha256:${crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')}`;
}

function normalizeText(value) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ');
}

function tokenize(text) {
  return new Set(
    normalizeText(text)
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 3)
  );
}

function overlapScore(a, b) {
  const left = tokenize(a);
  const right = tokenize(b);
  if (!left.size || !right.size) return 0;
  let shared = 0;
  for (const token of left) if (right.has(token)) shared += 1;
  return Number((shared / new Set([...left, ...right]).size).toFixed(3));
}

function simulateOutput(model, question) {
  const framing = {
    openai: 'Structure the question into objective, constraints, evidence, alternatives, and next action.',
    anthropic: 'Review risks, ambiguity, institutional constraints, edge cases, and required human judgment.',
    gemini: 'Map patterns, dependencies, system relationships, and missing context across the problem.',
    xai: 'Stress-test assumptions, identify weak claims, surface counterpoints, and propose direct alternatives.'
  };
  return `${framing[model]} Source question: ${normalizeText(question)}`;
}

function buildIndependentOutputs(question, suppliedOutputs = {}) {
  return COUNCIL_MODELS.map((model) => ({
    model,
    source: suppliedOutputs[model] ? 'supplied' : 'simulation',
    output: normalizeText(suppliedOutputs[model] || simulateOutput(model, question))
  }));
}

function buildCrossReview(outputs) {
  const reviews = [];
  for (const reviewer of outputs) {
    for (const subject of outputs) {
      if (reviewer.model === subject.model) continue;
      reviews.push({
        reviewer: reviewer.model,
        subject: subject.model,
        agreement: overlapScore(reviewer.output, subject.output),
        review: `Compare ${subject.model} against ${reviewer.model}: preserve shared supported signal, flag contradictions, missing evidence, and unique insight.`
      });
    }
  }
  return reviews;
}

function buildSignals(outputs, reviews) {
  const agreements = reviews.filter((item) => item.agreement >= 0.18);
  const disagreements = reviews.filter((item) => item.agreement < 0.08);
  return {
    agreementZones: agreements.map((item) => `${item.reviewer}↔${item.subject}`),
    contradictions: disagreements.map((item) => `${item.reviewer}↔${item.subject}`),
    missingIdeas: outputs.map((item) => `${item.model}: evidence expansion required before factual verification`),
    novelInsights: outputs.map((item) => `${item.model}: preserve distinct framing for human synthesis`),
    modelAgreementAverage: reviews.length
      ? Number((reviews.reduce((sum, item) => sum + item.agreement, 0) / reviews.length).toFixed(3))
      : 0,
    factualVerification: 'not_established_by_model_agreement'
  };
}

function createCouncilRun(payload = {}) {
  const question = normalizeText(payload.question || payload.input || payload.prompt || '');
  const requestedMode = payload.mode === 'live' ? 'live' : 'simulation';
  const suppliedOutputs = payload.outputs && typeof payload.outputs === 'object' ? payload.outputs : {};
  const outputs = buildIndependentOutputs(question, suppliedOutputs);
  const reviews = buildCrossReview(outputs);
  const signals = buildSignals(outputs, reviews);
  const runId = payload.runId || `OMOS-RUN-${Date.now()}`;

  const record = {
    runId,
    schemaVersion: '1.0.0',
    runtime: 'omos-runtime',
    runtimeMode: requestedMode,
    executionMode: requestedMode === 'live' ? 'adapter_required' : 'simulation',
    status: requestedMode === 'live' ? 'adapter_required' : 'human_review_required',
    pipeline: [
      'receive',
      'normalize',
      'independent_outputs',
      'cross_model_review',
      'signal_mapping',
      'human_synthesis',
      'verification'
    ],
    question,
    council: COUNCIL_MODELS,
    independentOutputs: outputs,
    crossReview: reviews,
    signals,
    humanSynthesis: {
      required: true,
      status: 'pending',
      instruction: 'Review agreement, contradictions, missing evidence, and distinct insights before approving a governed output.'
    },
    verification: {
      modelAgreementIsNotProof: true,
      factualVerification: 'pending',
      humanApprovalRequired: true
    },
    provenance: {
      inputHash: hash({ question }),
      outputHash: null,
      createdAtUtc: new Date().toISOString()
    }
  };

  record.provenance.outputHash = hash({ outputs, reviews, signals });
  return record;
}

module.exports = { COUNCIL_MODELS, createCouncilRun };
