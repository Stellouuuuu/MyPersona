const SESSION_KEY = 'persona_chat_session_id';

const DEFAULT_WEBHOOK =
  'http://localhost:5678/webhook/21821179-6560-462f-a678-8daf96d079ae/chat';

export function getOrCreateSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function resetSession() {
  const id = crypto.randomUUID();
  localStorage.setItem(SESSION_KEY, id);
  return id;
}

function resolveEndpoint() {
  const fromEnv = import.meta.env.VITE_N8N_WEBHOOK_URL;
  if (fromEnv) return fromEnv;
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get('webhook');
  if (fromQuery) {
    localStorage.setItem('persona_webhook_url', fromQuery);
    return fromQuery;
  }
  return localStorage.getItem('persona_webhook_url') || '/api/chat';
}

export function extractBotReply(data) {
  if (!data) return 'Réponse vide du serveur.';
  if (typeof data === 'string') return data;

  const candidates = [
    data.output,
    data.text,
    data.message,
    data.response,
    data.reply,
    data.data?.output,
    data.data?.text,
  ];

  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c;
  }

  if (Array.isArray(data)) {
    for (const item of data) {
      const nested = extractBotReply(item);
      if (nested && nested !== 'Réponse vide du serveur.') return nested;
    }
  }

  if (typeof data === 'object' && data.json?.output) return data.json.output;

  return 'Message reçu.';
}

export async function sendChatMessage(chatInput, sessionId) {
  const endpoint = resolveEndpoint();
  const body = {
    action: 'sendMessage',
    chatInput: chatInput.trim(),
    sessionId,
    metadata: { sessionId },
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(
      errText || `Erreur serveur (${response.status}). Vérifiez que N8N est accessible.`
    );
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { output: text };
  }
}

export { DEFAULT_WEBHOOK };
