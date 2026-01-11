const CACHE_NAME = "sotfware-app-cache-v1";
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
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache opened, adding URLs:", urlsToCache);
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache);
          }
          return null;
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Не обрабатываем запросы к API и другие не-GET запросы
  if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Если есть в кэше - возвращаем из кэша
      if (response) {
        console.log("Serving from cache:", event.request.url);
        return response;
      }
      
      // Иначе делаем сетевой запрос и кэшируем для будущего использования
      console.log("Fetching from network:", event.request.url);
      return fetch(event.request).then((networkResponse) => {
        // Клонируем ответ, так как он может быть использован только один раз
        const responseToCache = networkResponse.clone();
        
        // Кэшируем только успешные ответы и статичные ресурсы
        if (networkResponse.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        
        return networkResponse;
      }).catch((error) => {
        console.error("Fetch failed:", error);
        // Можно вернуть fallback страницу или пустой ответ
        return new Response("Network error", {
          status: 408,
          headers: { "Content-Type": "text/plain" }
        });
      });
    })
  );
});