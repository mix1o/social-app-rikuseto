const CACHE = 'V1';
const urls = ['index.html', 'offline.html'];

const self = this;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll(urls);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(() => {
      return fetch(event.request).catch(() => caches.match('offline.html'));
    })
  );
});

self.addEventListener('activate', e => {
  const cacheWhitelist = [];
  cacheWhitelist.push(CACHE);

  e.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(name => {
          if (!cacheWhitelist.includes(name)) caches.delete(name);
        })
      )
    )
  );
});
