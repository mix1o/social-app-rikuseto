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
          return null;
        })
      )
    )
  );
});

const receivePushNotification = event => {
  const options = {
    body: 'This notification was generated from a push!',
    icon: 'images/example.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2',
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore this new world',
        icon: 'images/checkmark.png',
      },
      { action: 'close', title: 'Close', icon: 'images/xmark.png' },
    ],
  };
  event.waitUntil(
    self.registration.showNotification('This is my notifiaction', options)
  );
};

function openPushNotification(event) {
  console.log(
    '[Service Worker] Notification click Received.',
    event.notification.data
  );

  event.notification.close();
  event.waitUntil(self.clients.openWindow(event.notification.data));
}

self.addEventListener('push', receivePushNotification);
self.addEventListener('notificationclick', openPushNotification);
