// Best-effort service worker. Cache-first shell + data; offline fallback page.
// Registration is wrapped in try/catch on the page — this file must never throw
// in a way that breaks the site (it can't: it only runs in the SW context).
const CACHE = 'hamro-bazaar-v1';
const SHELL = [
  '/',
  '/browse',
  '/announcements',
  '/request',
  '/list-business',
  '/offline.html',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()).catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
      .catch(() => {})
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  // Never intercept admin or API traffic.
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin')) return;

  event.respondWith(
    caches.match(request, { ignoreSearch: false }).then((cached) => {
      const network = fetch(request)
        .then((res) => {
          if (res.ok && url.origin === self.location.origin) {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => null);
      // Stale-while-revalidate for pages; fall back to offline page when truly offline.
      return network.then((res) => {
        if (res) return res;
        if (cached) return cached;
        if (request.mode === 'navigate') return caches.match('/offline.html');
        return new Response('offline', { status: 503 });
      });
    })
  );
});
