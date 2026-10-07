// POST /api/submit { type: 'announcement'|'review'|'featured', ...fields } — PUBLIC.
// Community submissions. Rate-limited + honeypot-protected.
// Goes to the moderation queue (pending); nothing goes live without approval.
import { readJson } from './lib/auth.js';
import { getJsonFile, putJsonFile, SUBMISSIONS_PATH, LISTINGS_PATH } from './lib/github.js';
import {
  validateAnnouncementSubmission,
  validateReviewSubmission,
  validateFeaturedRequest,
  validateSurvey,
} from './lib/validate.js';
import { rateLimit } from './lib/ratelimit.js';

const TYPES = {
  announcement: {
    validate: validateAnnouncementSubmission,
    commitMsg: (c) => `submission: announcement "${c.title.slice(0, 60)}"`,
  },
  review: {
    validate: validateReviewSubmission,
    commitMsg: (c) => `submission: review for ${c.listingId}`,
  },
  featured: {
    validate: validateFeaturedRequest,
    commitMsg: (c) => `submission: featured request "${c.businessName.slice(0, 60)}"`,
  },
  survey: {
    validate: validateSurvey,
    commitMsg: () => `submission: survey response`,
  },
};

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
    const t = TYPES[body.type];
    if (!t) return res.status(400).json({ error: 'unknown submission type' });
    const clean = t.validate(body);
    if (body.type === 'review') {
      const { data: listings } = await getJsonFile(LISTINGS_PATH);
      if (!listings.some((l) => l.id === clean.listingId)) {
        return res.status(400).json({ error: 'unknown listing' });
      }
    }
    const { data } = await getJsonFile(SUBMISSIONS_PATH);
    const record = {
      id: newSubId(),
      type: body.type,
      status: 'pending',
      created: new Date().toISOString(),
      ...clean,
    };
    data.push(record);
    await putJsonFile(SUBMISSIONS_PATH, data, t.commitMsg(clean));
    return res.status(201).json({ ok: true });
  } catch (err) {
    const msg = err.message || 'submission failed';
    const code = /spam detected/i.test(msg) ? 400 : 500;
    return res.status(code).json({ error: msg });
  }
}
