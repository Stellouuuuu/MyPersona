const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(500).json({
      output:
        'N8N_WEBHOOK_URL non configurée sur Vercel. Ajoutez la variable d\'environnement dans les settings du projet.',
    });
  }

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (process.env.N8N_BASIC_AUTH) {
      headers.Authorization = `Basic ${process.env.N8N_BASIC_AUTH}`;
    }

    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body),
    });

    const contentType = upstream.headers.get('content-type') || '';
    const body = contentType.includes('application/json')
      ? await upstream.json()
      : { output: await upstream.text() };

    return res.status(upstream.status).json(body);
  } catch (err) {
    return res.status(502).json({
      output: `Proxy error: ${err.message}. Vérifiez que N8N est accessible publiquement.`,
    });
  }
}
