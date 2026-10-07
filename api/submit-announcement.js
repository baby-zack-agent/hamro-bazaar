// POST /api/submit-announcement — PUBLIC.
// Community announcement submissions. Rate-limited + honeypot-protected.
// Goes to the moderation queue (pending); nothing goes live without approval.
import { readJson } from './lib/auth.js';
import { getJsonFile, putJsonFile, SUBMISSIONS_PATH } from './lib/github.js';
import { validateAnnouncementSubmission } from './lib/validate.js';
import { rateLimit } from './lib/ratelimit.js';

function newSubId() {
  return `sub-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method not allowed' });
  }
  if (!rateLimit(req).ok) {
    return res.status(429).json({ error: 'too many submissions — try again later' });
  }
  try {
    const body = await readJson(req);
    const clean = validateAnnouncementSubmission(body);
    const { data } = await getJsonFile(SUBMISSIONS_PATH);
    const record = {
      id: newSubId(),
      type: 'announcement',
      status: 'pending',
      created: new Date().toISOString(),
      ...clean,
    };
    data.push(record);
    await putJsonFile(SUBMISSIONS_PATH, data, `submission: announcement "${clean.title.slice(0, 60)}"`);
    return res.status(201).json({ ok: true });
  } catch (err) {
    const msg = err.message || 'submission failed';
    const code = /spam detected/i.test(msg) ? 400 : 500;
    return res.status(code).json({ error: msg });
  }
}
