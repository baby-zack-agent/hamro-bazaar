// /api/admin/announcements
//   GET  -> all announcements (newest first)
//   POST -> add announcement { title_en, title_ne, category, published? }
import { requireAdmin, readJson } from '../../lib/auth.js';
import { getJsonFile, putJsonFile, ANNOUNCEMENTS_PATH } from '../../lib/github.js';
import { validateAnnouncement } from '../../lib/validate.js';

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;

  try {
    if (req.method === 'GET') {
      const { data } = await getJsonFile(ANNOUNCEMENTS_PATH);
      const sorted = [...data].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      return res.status(200).json({ announcements: sorted });
    }

    if (req.method === 'POST') {
      const body = await readJson(req);
      const clean = validateAnnouncement(body);
      const { data } = await getJsonFile(ANNOUNCEMENTS_PATH);
      const record = {
        id: `ann-${Date.now().toString(36)}`,
        date: today(),
        ...clean,
      };
      data.push(record);
      await putJsonFile(ANNOUNCEMENTS_PATH, data, `admin: add announcement "${clean.title.en.slice(0, 60)}"`);
      return res.status(201).json({ announcement: record });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
