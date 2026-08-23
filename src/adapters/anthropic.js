function isConfigured() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

async function generate({ prompt, context = {} }) {
  if (!isConfigured()) throw new Error('ANTHROPIC_API_KEY_not_configured');
  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: 1200,
      system: 'You are participating in an OMOS Council independent analysis round. Return a concise structured answer with claims, evidence needs, risks, and recommendations. Do not claim consensus.',
      messages: [{ role: 'user', content: `${prompt}\n\nContext:\n${JSON.stringify(context)}` }]
    })
  });
  if (!response.ok) throw new Error(`anthropic_http_${response.status}`);
  const data = await response.json();
  const text = (data.content || []).map((item) => item.text || '').join('\n');
  return { model, output: text, simulated: false, metadata: { providerRequestId: data.id || null } };
}

module.exports = { isConfigured, generate };
