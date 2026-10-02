module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const prompt = req.body && req.body.prompt;
  if (!prompt || typeof prompt !== 'string' || prompt.length > 12000)
    return res.status(400).json({ error: 'Invalid prompt' });
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  console.log('Key present:', !!process.env.GEMINI_API_KEY, 'length:', (process.env.GEMINI_API_KEY || '').trim().length);
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': (process.env.GEMINI_API_KEY || '').trim() },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 4096 },
      }),
    });
    if (!r.ok) {
      console.error('Gemini error', r.status, await r.text());
      return res.status(502).json({ error: 'Generation failed' });
    }
    const d = await r.json();
    const parts = (d.candidates && d.candidates[0] && d.candidates[0].content && d.candidates[0].content.parts) || [];
    const text = parts.map((p) => p.text || '').join('');
    if (!text) return res.status(502).json({ error: 'Empty response' });
    res.status(200).json({ text });
  } catch (e) {
    console.error(e);
    res.status(502).json({ error: 'Generation failed' });
  }
};
