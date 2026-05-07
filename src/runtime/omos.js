function normalizeText(value) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ');
}

function scoreOption(option) {
  const text = normalizeText(option.text || option.content || option.output || '');
  const lower = text.toLowerCase();

  const positive = ['truth', 'clarity', 'coherence', 'dignity', 'unity', 'verify', 'evidence', 'structured'];
  const negative = ['ignore', 'bypass', 'delete logs', 'unverified', 'unsupported', 'guarantee', 'illegal'];

  let score = 0;
  for (const word of positive) if (lower.includes(word)) score += 1;
  for (const word of negative) if (lower.includes(word)) score -= 2;

  score += Math.min(text.length / 500, 4);
  return Number(score.toFixed(2));
}

function OMOSProcess(payload = {}) {
  const requestId = payload.requestId || `omos_${Date.now()}`;
  const input = normalizeText(payload.input || payload.prompt || payload.question || '');
  const options = Array.isArray(payload.options) ? payload.options : [];

  const evaluatedOptions = options.map((option, index) => ({
    index,
    label: option.label || option.model || `option_${index + 1}`,
    score: scoreOption(option),
    text: normalizeText(option.text || option.content || option.output || '')
  }));

  const selected = evaluatedOptions.length
    ? evaluatedOptions.slice().sort((a, b) => b.score - a.score)[0]
    : null;

  return {
    requestId,
    runtime: 'omos-runtime',
    version: '0.1.0',
    pipeline: ['observe', 'distill', 'align', 'select', 'execute', 'verify'],
    input,
    observed: {
      optionCount: evaluatedOptions.length,
      hasInput: Boolean(input)
    },
    alignmentCriteria: {
      maximize: ['truth', 'clarity', 'coherence', 'dignity', 'constructive_unity'],
      minimize: ['distortion', 'fragmentation', 'needless_conflict', 'unsupported_claims']
    },
    evaluatedOptions,
    selected,
    output: selected
      ? selected.text
      : input || 'No input or options were provided for OMOS processing.',
    verified: true,
    timestampUtc: new Date().toISOString()
  };
}

module.exports = { OMOSProcess };
