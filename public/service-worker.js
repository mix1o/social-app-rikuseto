const self = this;

const receivePushNotification = e => {
  self.clients.matchAll().then(c => {
    if (c.length === 0) {
    }
  });
  const { title, text, url } = e.data.json();

  //EG
  // const options = {
  //   data: url,
  //   body: text,
  //   icon: image,
  //   vibrate: [200, 100, 200],
  //   tag: tag,
  //   image: image,
  //   badge: 'https://spyna.it/icons/favicon.ico',
  //   actions: [
  //     {
  //       action: 'Detail',
  //       title: 'View',
  //       icon: 'https://via.placeholder.com/128/ff0000',
  //     },
  //   ],
  // };

  const options = {
    data: url,
    body: text,
    vibrate: [100, 50, 100],

    actions: [
      {
        action: 'Detail',
        title: 'Check it out',
        // icon: 'images/checkmark.png',
      },
      // #TODO Cancel notification
      { action: 'Close', title: 'Close' },
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
