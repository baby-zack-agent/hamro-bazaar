// Fire-and-forget tap analytics. Privacy-first: event names, listing ids,
// query-length buckets, and coarse contexts ONLY — never raw query text,
// never personal data. Uses navigator.sendBeacon so the hit survives page
// unload. Never throws; analytics must never break the page.
export function track(event, data = {}) {
  try {
    if (typeof navigator === 'undefined' || !navigator.sendBeacon) return;
    const payload = JSON.stringify({ event, ...data });
    navigator.sendBeacon('/api/event', new Blob([payload], { type: 'application/json' }));
  } catch {
    /* analytics is a bonus, not a requirement */
  }
}

// Query-length bucket for the `search` event — raw query text never leaves
// the device. 0: <5 chars, 1: 5-12, 2: 13-24, 3: 25+.
export function qlenBucket(q) {
  const n = String(q || '').trim().length;
  if (n < 5) return 0;
  if (n < 13) return 1;
  if (n < 25) return 2;
  return 3;
}
