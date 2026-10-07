// POST /api/submit-review — PUBLIC.
// Review submissions for a listing. Rate-limited + honeypot-protected.
// The listingId is verified against the live listings file.
// Goes to the moderation queue (pending); nothing shows without approval.
import { readJson } from './lib/auth.js';
import { getJsonFile, putJsonFile, SUBMISSIONS_PATH, LISTINGS_PATH } from './lib/github.js';
import { validateReviewSubmission } from './lib/validate.js';
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
    const clean = validateReviewSubmission(body);
    const { data: listings } = await getJsonFile(LISTINGS_PATH);
    if (!listings.some((l) => l.id === clean.listingId)) {
      return res.status(400).json({ error: 'unknown listing' });
    }
    const { data } = await getJsonFile(SUBMISSIONS_PATH);
    const record = {
      id: newSubId(),
      type: 'review',
      status: 'pending',
      created: new Date().toISOString(),
      ...clean,
    };
    data.push(record);
    await putJsonFile(SUBMISSIONS_PATH, data, `submission: review for ${clean.listingId}`);
    return res.status(201).json({ ok: true });
  } catch (err) {
    const msg = err.message || 'submission failed';
    const code = /spam detected/i.test(msg) ? 400 : 500;
    return res.status(code).json({ error: msg });
  }
}
