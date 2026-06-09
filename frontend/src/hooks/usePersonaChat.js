import { useCallback, useEffect, useRef, useState } from 'react';
import {
  extractBotReply,
  getOrCreateSessionId,
  resetSession,
  sendChatMessage,
} from '../lib/chatApi';

function nowTime() {
  return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function makeMessage(from, text) {
  return { id: crypto.randomUUID(), from, text, time: nowTime() };
}

export default function usePersonaChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  const sessionIdRef = useRef(getOrCreateSessionId());
  const bootstrapped = useRef(false);

  const deliver = useCallback(async (text) => {
    setLoading(true);
    setError(null);
    try {
      const data = await sendChatMessage(text, sessionIdRef.current);
      setMessages((prev) => [...prev, makeMessage('bot', extractBotReply(data))]);
      setConnected(true);
    } catch (err) {
      const msg =
        err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')
          ? 'Impossible de joindre le serveur Persona. Vérifiez que N8N est démarré et accessible.'
          : err.message || 'Erreur de connexion.';
      setError(msg);
      setMessages((prev) => [...prev, makeMessage('bot', `⚠️ ${msg}`)]);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;
      setMessages((prev) => [...prev, makeMessage('user', trimmed)]);
      await deliver(trimmed);
    },
    [loading, deliver]
  );

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    deliver('bonjour');
  }, [deliver]);

  const clearChat = useCallback(() => {
    sessionIdRef.current = resetSession();
    setMessages([]);
    setError(null);
    setConnected(false);
    bootstrapped.current = true;
    deliver('bonjour');
  }, [deliver]);

  return { messages, loading, error, connected, sendMessage, clearChat };
}
