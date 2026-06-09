/**
 * Persona — utilitaires HMAC pour liens RGPD signés.
 * Code dupliqué inline dans les workflows N8N ; ce fichier sert de référence et de tests locaux.
 */
const crypto = require('crypto');

const DEFAULT_SECRET = 'change-me-in-production';
const DEFAULT_BASE = 'http://localhost:5678';

function signGdprToken(userId, action, secret, hoursValid = 72) {
  const exp = Date.now() + hoursValid * 3600000;
  const payload = Buffer.from(JSON.stringify({ userId, action, exp })).toString('base64url');
  const sig = crypto.createHmac('sha256', secret || DEFAULT_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verifyGdprToken(token, secret) {
  const parts = (token || '').split('.');
  if (parts.length !== 2) return { valid: false, error: 'Format invalide' };
  const [payload, sig] = parts;
  const expected = crypto.createHmac('sha256', secret || DEFAULT_SECRET).update(payload).digest('base64url');
  if (sig !== expected) return { valid: false, error: 'Signature invalide' };
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (Date.now() > data.exp) return { valid: false, error: 'Token expiré' };
    return { valid: true, userId: data.userId, action: data.action };
  } catch {
    return { valid: false, error: 'Payload corrompu' };
  }
}

function gdprLink(userId, action, baseUrl, secret) {
  const token = signGdprToken(userId, action, secret);
  const base = (baseUrl || DEFAULT_BASE).replace(/\/$/, '');
  return `${base}/webhook/persona-gdpr?token=${encodeURIComponent(token)}&action=${action}`;
}

module.exports = { signGdprToken, verifyGdprToken, gdprLink };
