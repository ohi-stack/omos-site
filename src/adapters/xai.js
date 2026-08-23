function isConfigured() {
  return Boolean(process.env.XAI_API_KEY);
}

async function generate({ prompt, context = {} }) {
  if (!isConfigured()) throw new Error('XAI_API_KEY_not_configured');
  const model = process.env.XAI_MODEL || 'grok-4';
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.XAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'You are participating in an OMOS Council independent analysis round. Return a concise structured answer with claims, evidence needs, risks, and recommendations. Do not claim consensus.' },
        { role: 'user', content: `${prompt}\n\nContext:\n${JSON.stringify(context)}` }
      ]
    })
  });
  if (!response.ok) throw new Error(`xai_http_${response.status}`);
  const data = await response.json();
  const text = (((data.choices || [])[0] || {}).message || {}).content || '';
  return { model, output: text, simulated: false, metadata: { providerRequestId: data.id || null } };
}

module.exports = { isConfigured, generate };
