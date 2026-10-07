// /api/admin — all admin actions (HMAC session required).
// GET  ?resource=listings|announcements|submissions
// POST { action, ... } — actions:
//   listing-save { id?, ...fields }      add (no id) or update (with id)
//   listing-delete { id }
//   announcement-add { title_en, title_ne, category, published? }
//   announcement-publish { id, published }
//   featured-toggle { id, featured }
//   verify-toggle { id, verified }
//   submission-moderate { id, decision: 'approve'|'reject' }
// Every mutation commits its JSON file to GitHub.
import { requireAdmin, readJson } from './lib/auth.js';
import {
  getJsonFile, putJsonFile,
  LISTINGS_PATH, ANNOUNCEMENTS_PATH, SUBMISSIONS_PATH,
} from './lib/github.js';
import { validateListing, validateAnnouncement, newId } from './lib/validate.js';

const today = () => new Date().toISOString().slice(0, 10);

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
  listing.reviews.push({ name: sub.name, rating: sub.rating, text: sub.text, date: today() });
  await putJsonFile(LISTINGS_PATH, data, `moderation: approved review for ${sub.listingId}`);
}

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;

  try {
    if (req.method === 'GET') {
      const resource = new URL(req.url, 'http://x').searchParams.get('resource');
      if (resource === 'listings') {
        const { data } = await getJsonFile(LISTINGS_PATH);
        return res.status(200).json({ listings: data });
      }
      if (resource === 'announcements') {
        const { data } = await getJsonFile(ANNOUNCEMENTS_PATH);
        const sorted = [...data].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        return res.status(200).json({ announcements: sorted });
      }
      if (resource === 'submissions') {
        const { data } = await getJsonFile(SUBMISSIONS_PATH);
        const sorted = [...data].sort((a, b) => (b.created || '').localeCompare(a.created || ''));
        return res.status(200).json({ submissions: sorted });
      }
      return res.status(400).json({ error: 'unknown resource' });
    }

    if (req.method === 'POST') {
      const body = await readJson(req);

      if (body.action === 'listing-save') {
        const clean = validateListing(body, { isUpdate: !!body.id });
        const { data } = await getJsonFile(LISTINGS_PATH);
        if (body.id) {
          const idx = data.findIndex((l) => l.id === body.id);
          if (idx === -1) return res.status(404).json({ error: 'listing not found' });
          data[idx] = { ...data[idx], ...clean }; // preserve id/featured/verified
          await putJsonFile(LISTINGS_PATH, data, `admin: update listing ${data[idx].name}`);
          return res.status(200).json({ listing: data[idx] });
        }
        const record = { id: newId(clean.name, clean.phone), featured: false, verified: false, ...clean };
        data.push(record);
        await putJsonFile(LISTINGS_PATH, data, `admin: add listing ${record.name}`);
        return res.status(201).json({ listing: record });
      }

      if (body.action === 'listing-delete') {
        const { id } = body;
        if (!id) return res.status(400).json({ error: 'id is required' });
        const { data } = await getJsonFile(LISTINGS_PATH);
        const idx = data.findIndex((l) => l.id === id);
        if (idx === -1) return res.status(404).json({ error: 'listing not found' });
        const [removed] = data.splice(idx, 1);
        await putJsonFile(LISTINGS_PATH, data, `admin: delete listing ${removed.name}`);
        return res.status(200).json({ ok: true });
      }

      if (body.action === 'announcement-add') {
        const clean = validateAnnouncement(body);
        const { data } = await getJsonFile(ANNOUNCEMENTS_PATH);
        const record = { id: `ann-${Date.now().toString(36)}`, date: today(), ...clean };
        data.push(record);
        await putJsonFile(ANNOUNCEMENTS_PATH, data, `admin: add announcement "${clean.title.en.slice(0, 60)}"`);
        return res.status(201).json({ announcement: record });
      }

      if (body.action === 'announcement-publish') {
        const { id, published } = body;
        if (!id || typeof published !== 'boolean') {
          return res.status(400).json({ error: 'id and published (boolean) are required' });
        }
        const { data } = await getJsonFile(ANNOUNCEMENTS_PATH);
        const rec = data.find((a) => a.id === id);
        if (!rec) return res.status(404).json({ error: 'announcement not found' });
        rec.published = published;
        await putJsonFile(ANNOUNCEMENTS_PATH, data, `admin: published=${published} announcement ${id}`);
        return res.status(200).json({ announcement: rec });
      }

      if (body.action === 'featured-toggle') {
        const { id, featured } = body;
        if (!id || typeof featured !== 'boolean') {
          return res.status(400).json({ error: 'id and featured (boolean) are required' });
        }
        const { data } = await getJsonFile(LISTINGS_PATH);
        const rec = data.find((l) => l.id === id);
        if (!rec) return res.status(404).json({ error: 'listing not found' });
        rec.featured = featured;
        await putJsonFile(LISTINGS_PATH, data, `admin: featured=${featured} ${rec.name}`);
        return res.status(200).json({ listing: rec });
      }

      if (body.action === 'verify-toggle') {
        const { id, verified } = body;
        if (!id || typeof verified !== 'boolean') {
          return res.status(400).json({ error: 'id and verified (boolean) are required' });
        }
        const { data } = await getJsonFile(LISTINGS_PATH);
        const rec = data.find((l) => l.id === id);
        if (!rec) return res.status(404).json({ error: 'listing not found' });
        rec.verified = verified;
        await putJsonFile(LISTINGS_PATH, data, `admin: verified=${verified} ${rec.name}`);
        return res.status(200).json({ listing: rec });
      }

      if (body.action === 'submission-moderate') {
        const { id, decision } = body;
        if (!id || !['approve', 'reject'].includes(decision)) {
          return res.status(400).json({ error: "id and decision ('approve'|'reject') are required" });
        }
        const { data } = await getJsonFile(SUBMISSIONS_PATH);
        const sub = data.find((s) => s.id === id);
        if (!sub) return res.status(404).json({ error: 'submission not found' });
        if (sub.status !== 'pending') return res.status(400).json({ error: 'already moderated' });
        if (decision === 'approve') {
          if (sub.type === 'announcement') await approveAnnouncement(sub);
          else if (sub.type === 'review') await approveReview(sub);
          // featured-request: no data change; manual follow-up.
        }
        sub.status = decision === 'approve' ? 'approved' : 'rejected';
        sub.moderated = new Date().toISOString();
        await putJsonFile(SUBMISSIONS_PATH, data, `moderation: ${decision}d ${sub.type} ${id}`);
        return res.status(200).json({ ok: true, status: sub.status });
      }

      return res.status(400).json({ error: 'unknown action' });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
