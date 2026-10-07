// POST /api/event — PUBLIC tap analytics.
// Privacy-first by design: event names + listing ids + query-length buckets
// ONLY. No personal data, no IP storage, no cookies, no fingerprinting.
// Appends one JSON line to analytics/events-YYYY-MM-DD.jsonl via GitHub.
// The client fires with navigator.sendBeacon and never waits; this endpoint
// must never break the page, so failures are silent by design.
import { readJson } from './lib/auth.js';
import { getTextFile, putTextFile, ANALYTICS_PATH } from './lib/github.js';

const EVENTS = new Set(['call_tap', 'whatsapp_tap', 'search', 'survey_start']);

function cleanListingId(v) {
  return typeof v === 'string' && v ? v.slice(0, 60) : null;
}

function cleanQlen(v) {
  // Query-length bucket index 0..3 only — raw query text is never accepted.
  return Number.isInteger(v) && v >= 0 && v <= 3 ? v : null;
}

function cleanContext(v) {
  return typeof v === 'string' && v ? v.slice(0, 40) : null;
}

async function appendLine(path, line) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const { sha, text } = await getTextFile(path);
    try {
      await putTextFile(path, text + line, `analytics: ${path.slice(17, 27)}`, sha);
      return;
    } catch (err) {
      // Concurrent write raced us (stale sha) — re-read and retry once.
      if (attempt === 0 && /409|422/.test(err.message || '')) continue;
      throw err;
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method not allowed' });
  }
  try {
    const body = await readJson(req);
    const event = String(body.event || '');
    if (!EVENTS.has(event)) return res.status(400).json({ error: 'unknown event' });
    const line = JSON.stringify({
      t: new Date().toISOString(),
      event,
      listingId: cleanListingId(body.listingId),
      qlen: cleanQlen(body.qlen),
      context: cleanContext(body.context),
    }) + '\n';
    await appendLine(ANALYTICS_PATH(new Date()), line);
    return res.status(202).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'failed' });
  }
}
