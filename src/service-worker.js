const CACHE_NAME = 'security-helpdesk-cache-v1';

// Dynamically add the hashed files to cache
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/icons/icon-192x192.png',
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  // Use fetch to discover and cache hashed files
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return fetch('index.html').then((response) => {
        return response.text().then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const stylesHref = doc.querySelector('link[rel="stylesheet"]').getAttribute('href');
          const mainSrc = Array.from(doc.querySelectorAll('script')).find((script) => script.src.includes('main')).getAttribute('src');
          const runtimeSrc = Array.from(doc.querySelectorAll('script')).find((script) => script.src.includes('runtime')).getAttribute('src');
          const polyfillsSrc = Array.from(doc.querySelectorAll('script')).find((script) => script.src.includes('polyfills')).getAttribute('src');

          // Add hashed files to the cache
          return cache.addAll([
            stylesHref,
            mainSrc,
            runtimeSrc,
            polyfillsSrc,
            ...ASSETS_TO_CACHE,
          ]);
        });
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  console.log('[Service Worker] Fetching:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
