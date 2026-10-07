// Stateless admin sessions: cookie value is "<expiry>.<hmac>", where the HMAC is
// keyed by ADMIN_KEY. No server-side session store needed (serverless-safe).
import crypto from 'node:crypto';

const COOKIE = 'hb_admin';
const TTL_SEC = 7 * 24 * 3600;

function secret() {
  const s = process.env.ADMIN_KEY;
  if (!s) throw new Error('ADMIN_KEY is not configured');
  return s;
}

export function createSession() {
  const expiry = Math.floor(Date.now() / 1000) + TTL_SEC;
  const sig = crypto.createHmac('sha256', secret()).update(String(expiry)).digest('hex');
  return `${expiry}.${sig}`;
}

export function verifySession(cookieHeader) {
  try {
    const m = /(?:^|;\s*)hb_admin=([^;]+)/.exec(cookieHeader || '');
    if (!m) return false;
    const [expiry, sig] = decodeURIComponent(m[1]).split('.');
    if (!expiry || !sig) return false;
    if (Number(expiry) < Math.floor(Date.now() / 1000)) return false;
    const expected = crypto.createHmac('sha256', secret()).update(expiry).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function sessionCookie(value, { secure, maxAge = TTL_SEC } = {}) {
  const parts = [`${COOKIE}=${encodeURIComponent(value)}`, 'Path=/', 'HttpOnly', 'SameSite=Lax'];
  if (secure) parts.push('Secure');
  parts.push(`Max-Age=${maxAge}`);
  return parts.join('; ');
}

export function clearCookie(secure) {
  return sessionCookie('', { secure, maxAge: 0 });
}

export function isSecure(req) {
  const proto = req.headers['x-forwarded-proto'];
  if (proto) return proto === 'https';
  return !!process.env.VERCEL;
}

export function requireAdmin(req, res) {
  if (!verifySession(req.headers.cookie)) {
    res.status(401).json({ error: 'unauthorized' });
    return false;
  }
  return true;
}

// Reads a JSON body, tolerating runtimes that don't pre-parse it.
export async function readJson(req) {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') {
      try { return JSON.parse(req.body || '{}'); } catch { return {}; }
    }
    return req.body;
  }
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString('utf8');
  try { return JSON.parse(raw || '{}'); } catch { return {}; }
}
