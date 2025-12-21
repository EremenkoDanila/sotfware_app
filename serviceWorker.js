self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting(); // активируем сразу
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
});

self.addEventListener('fetch', (event) => {
  console.log('Fetching:', event.request.url);
  // Здесь можно добавить кеширование
});
