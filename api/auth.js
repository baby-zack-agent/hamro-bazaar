// POST /api/auth { action: 'login', key } -> sets httpOnly session cookie on success.
// POST /api/auth { action: 'logout' } -> clears the session cookie.
import { createSession, sessionCookie, clearCookie, isSecure, readJson } from './lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method not allowed' });
  }
  const secure = isSecure(req);
  try {
    const { action, key } = await readJson(req);
    if (action === 'logout') {
      res.setHeader('Set-Cookie', clearCookie(secure));
      return res.status(200).json({ ok: true });
    }
    if (action === 'login') {
      if (!process.env.ADMIN_KEY) {
        return res.status(500).json({ error: 'ADMIN_KEY is not configured' });
      }
      if (!key || key !== process.env.ADMIN_KEY) {
        // Constant-time-ish compare isn't critical here, but avoid leaking which check failed.
        await new Promise((r) => setTimeout(r, 300));
        return res.status(401).json({ error: 'invalid key' });
      }
      res.setHeader('Set-Cookie', sessionCookie(createSession(), { secure }));
      return res.status(200).json({ ok: true });
    }
    return res.status(400).json({ error: 'unknown action' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
