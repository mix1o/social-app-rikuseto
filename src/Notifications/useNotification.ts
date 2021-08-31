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

const checkNotificationSupport = notificationSupport();

const useNotification = () => {
  const [userPermission, setUserPermission] = useState(Notification.permission);
  const [userSubscription, setUserSubscription] = useState<any>();
  const [pushServerId, setPushServerId] = useState();
  const [error, setError] = useState<any>(false);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState('');

  const [cookies] = useCookies();
  const { user } = cookies;
  // Register SW if notification are supported
  useEffect(() => {
    if (checkNotificationSupport) {
      setLoading(true);
      setError(false);
      registerServiceWorker().then(() => {
        setLoading(false);
      });
    }
  }, []);

  //get existing user subscription for SW
  useEffect(() => {
    setLoading(true);
    setError(false);
    const getExistingSubscription = async () => {
      const existingSubscription = await getUserSubscription();
      if (existingSubscription === null) {
        // TODO Display to user if he wants to subscripe, Check if user have already addded this SW to his account
        setInfo('Do you want to get notification ?');
      }
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
    setError(false);
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
    createNotificationSubscription()
      .then(sub => {
        setUserSubscription(sub);
        if (sub?.endpoint) {
          const subJSON = JSON.parse(JSON.stringify(sub));

          axios.put(`${process.env.REACT_APP_API}/user/update-sw`, {
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
  };

  // //GARBAGE
  // const onClickSendSubscriptionToPushServer = async () => {
  //   setLoading(true);
  //   setError(false);

  //   fetch(`${process.env.REACT_APP_API}/subscription`, {
  //     credentials: 'omit',
  //     headers: {
  //       'content-type': 'application/json;charset=UTF-8',
  //       'sec-fetch-mode': 'cors',
  //     },
  //     body: JSON.stringify(userSubscription),
  //     method: 'POST',
  //     mode: 'cors',
  //   })
  //     .then((res: any) => {
  //       setPushServerId(res!.id);
  //       console.log(res.id);
  //     })
  //     .catch(err => {
  //       setLoading(false);
  //       setError(err);
  //     });
  // };

  // const onClickSendNotification = async () => {
  //   setLoading(true);
  //   setError(false);

  //   fetch(`${process.env.REACT_APP_API}/subscription/${pushServerId}`, {
  //     credentials: 'omit',
  //     headers: {
  //       'content-type': 'application/json;charset=UTF-8',
  //       'sec-fetch-mode': 'cors',
  //     },
  //     method: 'GET',
  //     mode: 'cors',
  //   }).catch(err => {
  //     setLoading(false);
  //     setError(err);
  //   });

  //   setLoading(false);
  // };
  return {
    askUserPermission,
    subscribeToPushNotification,
    removeServiceWorker,
    pushServerId,
    userPermission,
    checkNotificationSupport,
    userSubscription,
    error,
    loading,
    info,
  };
};
export default useNotification;
