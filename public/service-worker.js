const self = this;

const receivePushNotification = e => {
  self.clients.matchAll().then(c => {
    if (c.length === 0) {
    }
  });
  const { header, body, url, photo } = e.data.json();

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
    body,
    url,
    icon: photo,
    vibrate: [100, 50, 100],
    actions: [
      {
        action: 'details',
        title: 'Check it out',
        // icon: 'images/checkmark.png',
      },

      { action: 'close', title: 'Close' },
    ],
  };
  e.waitUntil(self.registration.showNotification(title, options));
};

const openPushNotification = e => {
  const { url } = e.data.json();

  e.notification.close();

  switch (e.action) {
    case 'details':
      client.openWindow(url);
      break;
    case 'close':
      e.notification.close();
      e.notification.cancel();
      break;
  }

  event.waitUntil(self.clients.openWindow(event.notification.data));
};

self.addEventListener('push', receivePushNotification);
self.addEventListener('notificationclick', openPushNotification);
