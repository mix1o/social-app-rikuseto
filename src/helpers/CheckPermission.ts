import { askPermission } from '../Notifications/push-notification';

export const checkPermission = () => {
  if (Notification.permission === 'granted') {
    return true;
  } else if (
    Notification.permission === 'default' ||
    Notification.permission !== 'denied'
  ) {
    askPermission();
    return false;
  }
  askPermission();
  return false;
};
