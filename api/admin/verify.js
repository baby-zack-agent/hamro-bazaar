// POST /api/admin/verify { id, verified } -> set verification status.
import { requireAdmin, readJson } from '../../lib/auth.js';
import { getJsonFile, putJsonFile, LISTINGS_PATH } from '../../lib/github.js';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method not allowed' });
  }
  try {
    const { id, verified } = await readJson(req);
    if (!id || typeof verified !== 'boolean') {
      return res.status(400).json({ error: 'id and verified (boolean) are required' });
    }
    const { data } = await getJsonFile(LISTINGS_PATH);
    const rec = data.find((l) => l.id === id);
    if (!rec) return res.status(404).json({ error: 'listing not found' });
    rec.verified = verified;
    await putJsonFile(LISTINGS_PATH, data, `admin: verified=${verified} ${rec.name}`);
    return res.status(200).json({ listing: rec });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
