/* KissCream 离线缓存
   - 页面导航：网络优先 → 每次打开都拿最新 HTML（发版即时生效），断网回落缓存
   - 静态资源：缓存优先 + 后台静默更新（这次用旧的，下次自动换新）
   改了图片/图标不必手动改版本号，第二次打开就会自动更新 */
const CACHE = 'kisscream-v12';
const CORE = [
  './',
  './index.html',
  './football.html',
  './gesture.html',
  './aigc.html',
  './diy.html',
  './imitate.html',
  './gk.js',
  './manifest.json',
  './assets/football.jpg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

/* 大文件（识别引擎 wasm / 手部模型）单独一个不版本化的缓存：
   普通发版会清 kisscream-v* 的缓存，但这 21MB 不该跟着被清掉 */
const MODEL_CACHE = 'kisscream-models';

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE).catch(() => {})));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== MODEL_CACHE).map((k) => caches.delete(k))))
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

  // 识别引擎 / 模型：走独立缓存，缓存优先（下过一次就不再下）
  if (/\/(vendor|models)\//.test(url.pathname)) {
    e.respondWith(
      caches.open(MODEL_CACHE).then((c) => c.match(req).then((hit) => {
        if (hit) return hit;
        return fetch(req).then((res) => {
          if (res && res.ok) c.put(req, res.clone()).catch(() => {});
          return res;
        });
      }))
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
