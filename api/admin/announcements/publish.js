// POST /api/admin/announcements/publish { id, published } -> publish/unpublish.
import { requireAdmin, readJson } from '../../../lib/auth.js';
import { getJsonFile, putJsonFile, ANNOUNCEMENTS_PATH } from '../../../lib/github.js';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method not allowed' });
  }
  try {
    const { id, published } = await readJson(req);
    if (!id || typeof published !== 'boolean') {
      return res.status(400).json({ error: 'id and published (boolean) are required' });
    }
    const { data } = await getJsonFile(ANNOUNCEMENTS_PATH);
    const rec = data.find((a) => a.id === id);
    if (!rec) return res.status(404).json({ error: 'announcement not found' });
    rec.published = published;
    await putJsonFile(ANNOUNCEMENTS_PATH, data, `admin: published=${published} announcement ${id}`);
    return res.status(200).json({ announcement: rec });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
