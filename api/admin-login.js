// POST /api/admin-login { key } -> sets httpOnly session cookie on success.
import { createSession, sessionCookie, isSecure, readJson } from './lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method not allowed' });
  }
  if (!process.env.ADMIN_KEY) {
    return res.status(500).json({ error: 'ADMIN_KEY is not configured' });
  }
  const { key } = await readJson(req);
  if (!key || key !== process.env.ADMIN_KEY) {
    // Constant-time-ish compare isn't critical here, but avoid leaking which check failed.
    await new Promise((r) => setTimeout(r, 300));
    return res.status(401).json({ error: 'invalid key' });
  }
  const secure = isSecure(req);
  res.setHeader('Set-Cookie', sessionCookie(createSession(), { secure }));
  return res.status(200).json({ ok: true });
}
