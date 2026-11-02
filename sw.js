/* Dragon Ball New Age — iPhone offline core v5 (2026-11-02).
   Core: guaranteed after successful installation. Cinema 4K: runtime cache. */
const CORE_CACHE = 'dbna-saga-core-v5';
const RUNTIME_CACHE = 'dbna-saga-runtime-v5';
const CORE = [
  './', './index.html', './manifest.webmanifest', './icon.svg',
  './saiyan.js?v=21', './saiyan.css?v=8',
  './visual-upgrade.css?v=8', './cinematic-0.8.css?v=17',
  './assets/earth-map-4k.svg?v=7', './assets/earth-battle-4k.svg?v=8',
  './assets/anime-scene-battle-v1.png', './assets/anime-scene-ki-v1.png',
  './assets/anime-rival-v04.svg?v=1',
  './assets/unknown-warrior.svg', './assets/goku-normal-idle.svg',
  './assets/characters/hero.svg?v=1',
  './assets/characters/bandit.svg?v=1',
  './assets/characters/drone.svg?v=1',
  './assets/characters/scout.svg?v=1',
  './assets/characters/saiba.svg?v=1',
  './assets/characters/saiba-boss.svg?v=1',
  './assets/characters/nappa.svg?v=1',
  './assets/characters/vegeta.svg?v=1',
  './assets/characters/roshi.svg?v=1',
  './assets/characters/ribbon.svg?v=1',
  './assets/characters/pig.svg?v=1',
  './assets/characters/martial.svg?v=1',
  './assets/characters/sentry.svg?v=1'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CORE_CACHE);
    // Atomic addAll: an incomplete core never becomes the active offline version.
    await cache.addAll(CORE);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key =>
      (key.startsWith('dbna-')) && key !== CORE_CACHE && key !== RUNTIME_CACHE
    ).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (!event.data || event.data.type !== 'DBNA_OFFLINE_CHECK') return;
  event.waitUntil((async () => {
    const cache = await caches.open(CORE_CACHE);
    const missing = [];
    for (const path of CORE) {
      const req = new Request(new URL(path, self.registration.scope));
      if (!(await cache.match(req, {ignoreSearch: true}))) missing.push(path);
    }
    const port = event.ports && event.ports[0];
    if (port) port.postMessage({type:'DBNA_OFFLINE_STATUS', ready:missing.length===0, missing});
  })());
});

async function saveRuntime(request, response) {
  if (!response.ok || response.type === 'opaque') return;
  try {
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.put(request, response);
    const keys = await cache.keys();
    // Cap optional 4K and HD content; do not evict essential core.
    if (keys.length > 24) await Promise.all(keys.slice(0, keys.length - 24).map(k => cache.delete(k)));
  } catch (error) {
    // Quota pressure must never break combat or corrupt localStorage.
    console.warn('Optional asset not cached:', error);
  }
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith('/sw.js')) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CORE_CACHE);
          event.waitUntil(cache.put(new Request(new URL('./index.html', self.registration.scope)), response.clone()).catch(()=>{}));
        }
        return response;
      } catch (error) {
        return (await caches.match(new Request(new URL('./index.html', self.registration.scope)), {ignoreSearch:true}))
          || new Response('Gra nie została jeszcze zapisana offline.', {status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request, {ignoreSearch:true});
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok) event.waitUntil(saveRuntime(request, response.clone()));
      return response;
    } catch (error) {
      return new Response('Zasób niedostępny offline', {status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
    }
  })());
});
