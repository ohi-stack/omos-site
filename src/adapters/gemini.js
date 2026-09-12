const DEFAULT_MODEL = 'gemini-2.5-pro';
const CONNECTOR_ID = 'OMOS-CONN-GOOGLE-GEMINI-0001';

function isConfigured() {
  return Boolean(process.env.GEMINI_API_KEY);
}

function selectedModel() {
  return process.env.GEMINI_MODEL || DEFAULT_MODEL;
}

function capabilities() {
  return {
    provider: 'gemini',
    connector: CONNECTOR_ID,
    api: 'generateContent',
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
  if (!isConfigured()) throw new Error('GEMINI_API_KEY_not_configured');
  const model = selectedModel();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`;
  const startedAt = Date.now();
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: 'You are the Google Gemini participant in an OMOS Council independent analysis round. Return a concise structured answer with claims, evidence needs, risks, uncertainties, and recommendations. Preserve meaningful dissent. Do not claim consensus or factual verification merely because models agree.' }]
      },
      contents: [{ role: 'user', parts: [{ text: `${prompt}\n\nOMOS Context:\n${JSON.stringify(context)}` }] }]
    })
  });
  const latencyMs = Date.now() - startedAt;
  if (!response.ok) throw new Error(`gemini_http_${response.status}`);
  const data = await response.json();
  const candidate = (data.candidates || [])[0] || {};
  const text = (candidate.content?.parts || []).map((item) => item.text || '').filter(Boolean).join('\n');
  return {
    provider: 'gemini',
    connector: CONNECTOR_ID,
    api: 'generateContent',
    model: data.modelVersion || model,
    output: text,
    latencyMs,
    simulated: false,
    metadata: {
      providerRequestId: data.responseId || null,
      providerStatus: candidate.finishReason ? 'completed' : null,
      usage: data.usageMetadata || null,
      finishReason: candidate.finishReason || null,
      humanApprovalRequired: true
    }
  };
}

module.exports = { isConfigured, capabilities, selectedModel, generate };
