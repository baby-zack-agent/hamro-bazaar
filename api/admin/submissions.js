// /api/admin/submissions
//   GET  -> all submissions, newest first
//   POST { id, action: 'approve' | 'reject' } -> moderate
// Approving an announcement appends it to announcements.json (published).
// Approving a review appends it to the listing's `reviews` array.
// Approving a featured-request just marks it approved — payment confirmation
// and spot activation are manual follow-up.
import { requireAdmin, readJson } from '../../lib/auth.js';
import {
  getJsonFile, putJsonFile,
  SUBMISSIONS_PATH, ANNOUNCEMENTS_PATH, LISTINGS_PATH,
} from '../../lib/github.js';

function today() {
  return new Date().toISOString().slice(0, 10);
}

async function approveAnnouncement(sub) {
  const { data } = await getJsonFile(ANNOUNCEMENTS_PATH);
  const record = {
    id: `ann-${Date.now().toString(36)}`,
    date: today(),
    category: sub.category,
    businessName: sub.businessName,
    published: true,
    // Submitters write in one language; mirror it into both slots until translated.
    title: { en: sub.title, ne: sub.title },
    details: sub.details || '',
  };
  data.push(record);
  await putJsonFile(ANNOUNCEMENTS_PATH, data, `moderation: approved announcement "${sub.title.slice(0, 60)}"`);
  return record;
}

async function approveReview(sub) {
  const { data } = await getJsonFile(LISTINGS_PATH);
  const listing = data.find((l) => l.id === sub.listingId);
  if (!listing) throw new Error('listing not found');
  listing.reviews = listing.reviews || [];
  listing.reviews.push({
    name: sub.name,
    rating: sub.rating,
    text: sub.text,
    date: today(),
  });
  await putJsonFile(LISTINGS_PATH, data, `moderation: approved review for ${sub.listingId}`);
}

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;

  try {
    if (req.method === 'GET') {
      const { data } = await getJsonFile(SUBMISSIONS_PATH);
      const sorted = [...data].sort((a, b) => (b.created || '').localeCompare(a.created || ''));
      return res.status(200).json({ submissions: sorted });
    }

    if (req.method === 'POST') {
      const { id, action } = await readJson(req);
      if (!id || !['approve', 'reject'].includes(action)) {
        return res.status(400).json({ error: "id and action ('approve'|'reject') are required" });
      }
      const { data } = await getJsonFile(SUBMISSIONS_PATH);
      const sub = data.find((s) => s.id === id);
      if (!sub) return res.status(404).json({ error: 'submission not found' });
      if (sub.status !== 'pending') {
        return res.status(400).json({ error: 'already moderated' });
      }
      if (action === 'approve') {
        if (sub.type === 'announcement') await approveAnnouncement(sub);
        else if (sub.type === 'review') await approveReview(sub);
        // featured-request: no data change; manual follow-up.
      }
      sub.status = action === 'approve' ? 'approved' : 'rejected';
      sub.moderated = new Date().toISOString();
      await putJsonFile(SUBMISSIONS_PATH, data, `moderation: ${action}d ${sub.type} ${id}`);
      return res.status(200).json({ ok: true, status: sub.status });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
