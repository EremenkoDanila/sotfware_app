const CACHE_NAME = "tile-notes-cache-v1";
const urlsToCache = ["/RepoName/", "/RepoName/index.html", "/RepoName/icons/it_soft-192.png", "/RepoName/icons/it_soft-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(cacheNames.map((cache) => (cache !== CACHE_NAME ? caches.delete(cache) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then((response) => response || fetch(event.request)));
});
