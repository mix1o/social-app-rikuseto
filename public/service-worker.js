const self = this;

const receivePushNotification = e => {
  self.clients.matchAll().then(c => {
    if (c.length === 0) {
      const { header, body, url, photo } = e.data.json();

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
      e.waitUntil(self.registration.showNotification(header, options));
    }
  });

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
};

const openPushNotification = e => {
  const { url } = e.data.json();

  e.notification.close();

  switch (e.action) {
    case 'details':
      self.client.openWindow(url);
      break;
    case 'close':
      e.notification.close();
      e.notification.cancel();
      break;

    default:
      return;
  }

  e.waitUntil(self.clients.openWindow(e.notification.data));
};

const onChangeSubscription = e => {
  e.waitUntil(
    fetch(`${process.env.REACT_APP_API}/sw/update-sw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        old_endpoint: e.oldSubscription ? e.oldSubscription.endpoint : null,
        new_endpoint: e.newSubscription ? e.newSubscription.endpoint : null,
        new_p256dh: e.newSubscription
          ? e.newSubscription.toJSON().keys.p256dh
          : null,
        new_auth: e.newSubscription
          ? e.newSubscription.toJSON().keys.auth
          : null,
      }),
    })
  );
}; //TODO get user from cookies

self.addEventListener('push', receivePushNotification);
self.addEventListener('notificationclick', openPushNotification);
self.addEventListener('pushsubscriptionchange', onChangeSubscription);
