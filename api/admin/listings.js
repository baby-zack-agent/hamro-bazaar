// /api/admin/listings
//   GET    -> all listings (newest first by name)
//   POST   -> add (no id) or update (with id); body validated server-side
//   DELETE -> remove by { id }
// Every mutation commits src/data/listings.json to GitHub (triggers redeploy).
import { requireAdmin, readJson } from '../lib/auth.js';
import { getJsonFile, putJsonFile, LISTINGS_PATH } from '../lib/github.js';
import { validateListing, newId } from '../lib/validate.js';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;

  try {
    if (req.method === 'GET') {
      const { data } = await getJsonFile(LISTINGS_PATH);
      return res.status(200).json({ listings: data });
    }

    if (req.method === 'POST') {
      const body = await readJson(req);
      const clean = validateListing(body, { isUpdate: !!body.id });
      const { data } = await getJsonFile(LISTINGS_PATH);

      if (body.id) {
        const idx = data.findIndex((l) => l.id === body.id);
        if (idx === -1) return res.status(404).json({ error: 'listing not found' });
        data[idx] = { ...data[idx], ...clean }; // preserve id/featured/verified
        await putJsonFile(LISTINGS_PATH, data, `admin: update listing ${data[idx].name}`);
        return res.status(200).json({ listing: data[idx] });
      }

      const record = {
        id: newId(clean.name, clean.phone),
        featured: false,
        verified: false,
        ...clean,
      };
      data.push(record);
      await putJsonFile(LISTINGS_PATH, data, `admin: add listing ${record.name}`);
      return res.status(201).json({ listing: record });
    }

    if (req.method === 'DELETE') {
      const { id } = await readJson(req);
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { data } = await getJsonFile(LISTINGS_PATH);
      const idx = data.findIndex((l) => l.id === id);
      if (idx === -1) return res.status(404).json({ error: 'listing not found' });
      const [removed] = data.splice(idx, 1);
      await putJsonFile(LISTINGS_PATH, data, `admin: delete listing ${removed.name}`);
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
