function isConfigured() {
  return Boolean(process.env.GEMINI_API_KEY);
}

async function generate({ prompt, context = {} }) {
  if (!isConfigured()) throw new Error('GEMINI_API_KEY_not_configured');
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-pro';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: 'You are participating in an OMOS Council independent analysis round. Return a concise structured answer with claims, evidence needs, risks, and recommendations. Do not claim consensus.' }]
      },
      contents: [{ role: 'user', parts: [{ text: `${prompt}\n\nContext:\n${JSON.stringify(context)}` }] }]
    })
  });
  if (!response.ok) throw new Error(`gemini_http_${response.status}`);
  const data = await response.json();
  const text = (((data.candidates || [])[0] || {}).content || {}).parts?.map((item) => item.text || '').join('\n') || '';
  return { model, output: text, simulated: false, metadata: { finishReason: ((data.candidates || [])[0] || {}).finishReason || null } };
}

module.exports = { isConfigured, generate };
