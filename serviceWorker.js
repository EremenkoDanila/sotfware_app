const CACHE_NAME = "software-app-cache-v1";
const urlsToCache = [
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
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});