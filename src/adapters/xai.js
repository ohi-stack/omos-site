const DEFAULT_MODEL = 'grok-4';
const CONNECTOR_ID = 'OMOS-CONN-XAI-GROK-0001';
const API_URL = 'https://api.x.ai/v1/chat/completions';

function isConfigured() {
  return Boolean(process.env.XAI_API_KEY);
}

function selectedModel() {
  return process.env.XAI_MODEL || DEFAULT_MODEL;
}

function capabilities() {
  return {
    provider: 'xai',
    connector: CONNECTOR_ID,
    api: 'chat_completions',
    model: selectedModel(),
    configured: isConfigured(),
    modelCapabilities: {
      streaming: true,
      toolUse: true,
      structuredText: true
    },
    omosAuthorization: {
      consequentialExecution: false,
      humanApprovalRequired: true
    }
  };
}

async function generate({ prompt, context = {} }) {
  if (!isConfigured()) throw new Error('XAI_API_KEY_not_configured');
  const model = selectedModel();
  const startedAt = Date.now();
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.XAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'You are the xAI participant in an OMOS Council independent analysis round. Return a concise structured answer with claims, evidence needs, risks, uncertainties, and recommendations. Preserve meaningful dissent. Do not claim consensus or factual verification merely because models agree.' },
        { role: 'user', content: `${prompt}\n\nOMOS Context:\n${JSON.stringify(context)}` }
      ]
    })
  });
  const latencyMs = Date.now() - startedAt;
  if (!response.ok) throw new Error(`xai_http_${response.status}`);
  const data = await response.json();
  const choice = (data.choices || [])[0] || {};
  const text = choice.message?.content || '';
  return {
    provider: 'xai',
    connector: CONNECTOR_ID,
    api: 'chat_completions',
    model: data.model || model,
    output: text,
    latencyMs,
    simulated: false,
    metadata: {
      providerRequestId: data.id || null,
      providerStatus: choice.finish_reason ? 'completed' : null,
      usage: data.usage || null,
      finishReason: choice.finish_reason || null,
      humanApprovalRequired: true
    }
  };
}

module.exports = { isConfigured, capabilities, selectedModel, generate };
