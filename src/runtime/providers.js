const DEFAULT_TIMEOUT_MS = Number(process.env.OMOS_MODEL_TIMEOUT_MS || 45000);

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

async function fetchJson(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const body = await response.text();
    let data = null;
    try { data = body ? JSON.parse(body) : null; } catch { data = { raw: body }; }
    if (!response.ok) {
      const error = new Error(`Provider request failed (${response.status})`);
      error.status = response.status;
      error.providerBody = data;
      throw error;
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

function openAIAdapter(config = {}) {
  const apiKey = config.apiKey || process.env.OPENAI_API_KEY;
  const model = config.model || process.env.OPENAI_MODEL || 'gpt-5';
  return {
    id: 'openai',
    model,
    configured: Boolean(apiKey),
    async generate({ system, prompt }) {
      if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');
      const data = await fetchJson('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model, instructions: system, input: prompt })
      });
      return cleanText(data.output_text || (data.output || []).flatMap(x => x.content || []).map(x => x.text || '').join('\n'));
    }
  };
}

function anthropicAdapter(config = {}) {
  const apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY;
  const model = config.model || process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';
  return {
    id: 'anthropic',
    model,
    configured: Boolean(apiKey),
    async generate({ system, prompt }) {
      if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not configured');
      const data = await fetchJson('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({ model, max_tokens: 1800, system, messages: [{ role: 'user', content: prompt }] })
      });
      return cleanText((data.content || []).map(x => x.text || '').join('\n'));
    }
  };
}

function geminiAdapter(config = {}) {
  const apiKey = config.apiKey || process.env.GEMINI_API_KEY;
  const model = config.model || process.env.GEMINI_MODEL || 'gemini-2.5-pro';
  return {
    id: 'gemini',
    model,
    configured: Boolean(apiKey),
    async generate({ system, prompt }) {
      if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const data = await fetchJson(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ system_instruction: { parts: [{ text: system }] }, contents: [{ role: 'user', parts: [{ text: prompt }] }] })
      });
      return cleanText((data.candidates || []).flatMap(c => c.content?.parts || []).map(p => p.text || '').join('\n'));
    }
  };
}

function xaiAdapter(config = {}) {
  const apiKey = config.apiKey || process.env.XAI_API_KEY;
  const model = config.model || process.env.XAI_MODEL || 'grok-4';
  return {
    id: 'xai',
    model,
    configured: Boolean(apiKey),
    async generate({ system, prompt }) {
      if (!apiKey) throw new Error('XAI_API_KEY is not configured');
      const data = await fetchJson('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model, messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }] })
      });
      return cleanText(data.choices?.[0]?.message?.content || '');
    }
  };
}

function getProviderRegistry() {
  const providers = [openAIAdapter(), anthropicAdapter(), geminiAdapter(), xaiAdapter()];
  return Object.fromEntries(providers.map(provider => [provider.id, provider]));
}

module.exports = { getProviderRegistry, openAIAdapter, anthropicAdapter, geminiAdapter, xaiAdapter };
