// serviceWorker.js
const CACHE_NAME = "software-app-v1";
const CACHE_URLS = [
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
  console.log("Service Worker installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache opened");
      // Добавляем только существующие файлы
      return Promise.all(
        CACHE_URLS.map(url => {
          return cache.add(url).catch(err => {
            console.warn(`Failed to cache ${url}:`, err);
          });
        })
      );
    }).then(() => {
      console.log("All resources cached");
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log("Activation complete");
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  
  // Игнорируем не-GET запросы и API
  if (event.request.method !== 'GET') return;
  if (url.pathname.includes('/api/')) return;
  
  // Для кэшированных ресурсов
  if (CACHE_URLS.some(cacheUrl => url.pathname === cacheUrl)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
    return;
  }
  
  // Для корневого пути
  if (url.pathname === '/sotfware_app/' || url.pathname === '/sotfware_app') {
    event.respondWith(
      caches.match('/sotfware_app/index.html').then((response) => {
        return response || fetch(event.request);
      })
    );
    return;
  }
  
  // Для всех остальных файлов - пробуем сеть
  event.respondWith(
    fetch(event.request).catch(() => {
      // Если не получилось, пробуем найти похожий ресурс в кэше
      return caches.match(event.request);
    })
  );
});