const pushServerPublicKey =
  'BIN2Jc5Vmkmy-S3AUrcMlpKxJpLeVRAfu9WBqUbJ70SJOCWGCGXKY-Xzyh7HDr6KbRDGYHjqZ06OcS3BjD7uAm8';

export const notificationSupport = () =>
  'serviceWorker' in navigator && 'PushManager' in window;

export const registerServiceWorker = () =>
  navigator.serviceWorker.register('/service-worker.js');

export const askPermission = async () => await Notification.requestPermission();

export const createNotificationSubscription = async () => {
  if (!notificationSupport()) return null;

  const SW = await navigator.serviceWorker.ready;

  return await SW.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: pushServerPublicKey,
  });
};

export const getUserSubscription = async () => {
  const SW = await navigator.serviceWorker.ready;
  const getSubscription = await SW.pushManager.getSubscription();

  return getSubscription;
};
