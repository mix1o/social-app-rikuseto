export const notificationSupport = () =>
  'serviceWorker' in navigator && 'PushManager' in window;

export const registerServiceWorker = () =>
  navigator.serviceWorker.register('/service-worker.js');

export const askPermission = async () => await Notification.requestPermission();

export const createNotificationSubscription = async () => {
  if (!notificationSupport()) throw new Error('Notification are not supported');

  const SW = await navigator.serviceWorker.ready;

  return await SW.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.REACT_APP_VAPID_KEY_PUBLIC,
  });
};

export const getUserSubscription = async () => {
  if (!notificationSupport()) throw new Error('Notification are not supported');

  const SW = await navigator.serviceWorker.ready;
  const getSubscription = await SW.pushManager.getSubscription();

  return getSubscription;
};
