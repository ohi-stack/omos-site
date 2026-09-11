const DEFAULT_MODEL = 'claude-sonnet-4-20250514';
const CONNECTOR_ID = 'OMOS-CONN-ANTHROPIC-CLAUDE-0001';
const API_URL = 'https://api.anthropic.com/v1/messages';

function isConfigured() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

function selectedModel() {
  return process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;
}

function capabilities() {
  return {
    provider: 'anthropic',
    connector: CONNECTOR_ID,
    api: 'messages',
    model: selectedModel(),
    configured: isConfigured(),
    modelCapabilities: {
      streaming: true,
      toolUse: true,
      imageInput: true,
      structuredText: true
    },
    omosAuthorization: {
      consequentialExecution: false,
      humanApprovalRequired: true
    }
  };
}

async function generate({ prompt, context = {} }) {
  if (!isConfigured()) throw new Error('ANTHROPIC_API_KEY_not_configured');
  const model = selectedModel();
  const startedAt = Date.now();
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: 1200,
      system: 'You are the Anthropic participant in an OMOS Council independent analysis round. Return a concise structured answer with claims, evidence needs, risks, uncertainties, and recommendations. Preserve meaningful dissent. Do not claim consensus or factual verification merely because models agree.',
      messages: [{ role: 'user', content: `${prompt}\n\nOMOS Context:\n${JSON.stringify(context)}` }]
    })
  });
  const latencyMs = Date.now() - startedAt;
  if (!response.ok) throw new Error(`anthropic_http_${response.status}`);
  const data = await response.json();
  const text = (data.content || []).map((item) => item.text || '').filter(Boolean).join('\n');
  return {
    provider: 'anthropic',
    connector: CONNECTOR_ID,
    api: 'messages',
    model: data.model || model,
    output: text,
    latencyMs,
    simulated: false,
    metadata: {
      providerRequestId: data.id || null,
      providerStatus: data.stop_reason ? 'completed' : null,
      usage: data.usage || null,
      stopReason: data.stop_reason || null,
      humanApprovalRequired: true
    }
  };
}

module.exports = { isConfigured, capabilities, selectedModel, generate };
