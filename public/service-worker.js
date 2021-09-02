const self = this;

const receivePushNotification = e => {
  self.clients.matchAll().then(c => {
    if (c.length === 0) {
    }
  });
  const { title, text, url } = e.data.json();

  const options = {
    body: text,
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2',
    },
    actions: [
      {
        action: 'explore',
        title: 'DIS',
        // icon: 'images/checkmark.png',
      },
      { action: 'close', title: 'Close' },
    ],
  };
  e.waitUntil(self.registration.showNotification(title, options));
};

const openPushNotification = event => {
  console.log(
    '[Service Worker] Notification click Received.',
    event.notification.data
  );

  event.notification.close();
  event.waitUntil(self.clients.openWindow(event.notification.data));
};

self.addEventListener('push', receivePushNotification);
self.addEventListener('notificationclick', openPushNotification);
