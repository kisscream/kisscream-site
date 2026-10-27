/* KissCream 离线缓存
   - 页面导航：网络优先 → 每次打开都拿最新 HTML（发版即时生效），断网回落缓存
   - 静态资源：缓存优先 + 后台静默更新（这次用旧的，下次自动换新）
   改了图片/图标不必手动改版本号，第二次打开就会自动更新 */
const CACHE = 'kisscream-v2';
const CORE = [
  './',
  './index.html',
  './football.html',
  './gesture.html',
  './aigc.html',
  './manifest.json',
  './assets/football.jpg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE).catch(() => {})));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // 页面导航：网络优先，断网回落缓存
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  // 静态资源：先给缓存，同时后台拉新（stale-while-revalidate）
  e.respondWith(
    caches.match(req).then((hit) => {
      const fresh = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => null);
      return hit || fresh.then((r) => r || new Response('', { status: 504 }));
    })
  );
});
