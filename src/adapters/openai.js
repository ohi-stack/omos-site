function isConfigured() {
  return Boolean(process.env.OPENAI_API_KEY);
}

async function generate({ prompt, context = {} }) {
  if (!isConfigured()) throw new Error('OPENAI_API_KEY_not_configured');

  const model = process.env.OPENAI_MODEL || 'gpt-5';
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: 'system',
          content: [{ type: 'input_text', text: 'You are participating in an OMOS Council independent analysis round. Return a concise, structured answer with claims, evidence needs, risks, and recommendations. Do not claim consensus.' }]
        },
        {
          role: 'user',
          content: [{ type: 'input_text', text: `${prompt}\n\nContext:\n${JSON.stringify(context)}` }]
        }
      ]
    })
  });

  if (!response.ok) throw new Error(`openai_http_${response.status}`);
  const data = await response.json();
  const text = data.output_text || (data.output || []).flatMap((item) => item.content || []).map((item) => item.text || '').join('\n');
  return { model, output: text, simulated: false, metadata: { providerRequestId: data.id || null } };
}

module.exports = { isConfigured, generate };
