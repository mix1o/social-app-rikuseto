import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  notificationSupport,
  registerServiceWorker,
  askPermission,
  createNotificationSubscription,
  getUserSubscription,
} from './push-notification';
import { useCookies } from 'react-cookie';
import { CookieUser } from '../../interfaces/auth/authInterface';

const checkNotificationSupport = notificationSupport();

const useNotification = () => {
  const [userPermission, setUserPermission] = useState(Notification.permission);
  const [userSubscription, setUserSubscription] = useState<any>();
  const [error, setError] = useState<any>(false);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState('');

  const [cookies] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;
  // Register SW if notification are supported
  useEffect(() => {
    if (checkNotificationSupport) {
      setLoading(true);
      setError(false);
      registerServiceWorker().then(() => {
        setLoading(false);
      });
    } else {
      setError('Push Notifications are not supported on your device');
    }
  }, []);

  //get existing user subscription for SW
  useEffect(() => {
    setLoading(true);
    setError(false);
    const getExistingSubscription = async () => {
      const existingSubscription = await getUserSubscription();
      if (existingSubscription === null) return null;

      setUserSubscription(existingSubscription);
      setLoading(false);
      setInfo('');
    };
    getExistingSubscription();
  }, []);

  const removeServiceWorker = async () => {
    if (notificationSupport()) {
      const sw = await navigator.serviceWorker.getRegistration();
      sw?.unregister();
    }
  };
  //On click to ask user for permission
  const askUserPermission = () => {
    setLoading(true);
    setError('');
    askPermission().then(consent => {
      setUserPermission(consent);
      if (consent !== 'granted') {
        setError({
          name: 'Consent denied',
          message: 'You denied the consent to receive notifications',
          code: 0,
        });
      }
      setLoading(false);
    });
  };

  const subscribeToPushNotification = () => {
    setLoading(true);
    setError(false);
    const indexSw = user.serviceWorkers?.findIndex(
      sw => sw.endpoint === userSubscription.endpoint
    );

    if (indexSw === -1) {
      createNotificationSubscription()
        .then(sub => {
          setUserSubscription(sub);
          if (sub?.endpoint) {
            const subJSON = JSON.parse(JSON.stringify(sub));

            axios.put(`${process.env.REACT_APP_API}/sw/add-sw`, {
              subscription: {
                endpoint: sub?.endpoint,
                keys: {
                  auth: subJSON.keys.auth,
                  p256dh: subJSON.keys.p256dh,
                },
              },
              userId: user._id,
            });
          }

          setLoading(false);
        })
        .catch(err => {
          if (Notification.permission === 'denied') {
            setError('Permission for notifications was denied');
          }
          setError(err);
          setLoading(false);
        });
    }
  };

  const checkUserPermission = () => {
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

  return {
    askUserPermission,
    subscribeToPushNotification,
    checkUserPermission,
    removeServiceWorker,
    userPermission,
    checkNotificationSupport,
    userSubscription,
    error,
    loading,
    info,
  };
};
export default useNotification;
