const CACHE_NAME = "sotfware-app-cache-v1";
const STATIC_ASSETS = [
  "/sotfware_app/",
  "/sotfware_app/index.html",
  "/sotfware_app/manifest.json",
  "/sotfware_app/icons/it_soft.png",
  "/sotfware_app/icons/Git_icon.png",
  "/sotfware_app/icons/Postgre_SQL.png",
  "/sotfware_app/icons/dbeaver.png",
  "/sotfware_app/icons/search.png",
  "/sotfware_app/icons/cart.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Для статических файлов (иконки, манифест) используем кэш
  if (event.request.url.includes('/icons/') || 
      event.request.url.endsWith('manifest.json') ||
      event.request.url.endsWith('index.html')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  } else {
    // Для всех остальных файлов (JS, CSS) просто делаем сетевой запрос
    event.respondWith(fetch(event.request));
  }
});