// Best-effort in-memory rate limiting for public write endpoints.
// Serverless instances don't share memory, so this is per-instance only.
// It stops casual spam; determined abuse needs a real store (Phase 3).
const buckets = new Map(); // ip -> array of hit timestamps (ms)

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (fwd) return String(fwd).split(',')[0].trim();
  return (req.socket && req.socket.remoteAddress) || 'unknown';
}

export function rateLimit(req, { max = 5, windowMs = 60 * 60 * 1000 } = {}) {
  const ip = clientIp(req);
  const now = Date.now();
  const hits = (buckets.get(ip) || []).filter((t) => now - t < windowMs);
  if (hits.length >= max) return { ok: false, ip };
  hits.push(now);
  buckets.set(ip, hits);
  // Occasional prune so the map can't grow forever.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (!v.length || now - v[v.length - 1] > windowMs) buckets.delete(k);
    }
  }
  return { ok: true, ip };
}
