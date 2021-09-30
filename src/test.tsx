// import React, { useEffect } from 'react';
// import useNotification from './Hooks/Notifications/useNotification';
// const Test = () => {
//   const {
//     askUserPermission,
//     subscribeToPushNotification,
//     onClickSendSubscriptionToPushServer,
//     onClickSendNotification,
//     pushServerId,
//     userPermission,
//     checkNotificationSupport,
//     userSubscription,
//     error,
//     loading,
//   } = useNotification();
//   const isConsentGranted = userPermission === 'granted';
//   function displayNotification() {
//     if (isConsentGranted) {
//       navigator.serviceWorker.getRegistration().then(reg => {
//         reg!.showNotification('Hello world!');
//       });
//     }
//   }
//   useEffect(() => {
//     displayNotification();
//   }, []);
//   return (
//     <main>
//       <p>
//         Push notification are {!checkNotificationSupport && 'NOT'} supported by
//         your device.
//       </p>

//       <p>
//         User consent to recevie push notificaitons is{' '}
//         <strong>{userPermission}</strong>.
//       </p>

//       <button
//         disabled={!checkNotificationSupport || isConsentGranted}
//         onClick={askUserPermission}
//       >
//         {isConsentGranted ? 'Consent granted' : ' Ask user permission'}
//       </button>

//       <button
//         disabled={
//           !checkNotificationSupport || !isConsentGranted || userSubscription
//         }
//         onClick={subscribeToPushNotification}
//       >
//         {userSubscription
//           ? 'Push subscription created'
//           : 'Create Notification subscription'}
//       </button>

//       <button
//         disabled={!userSubscription || pushServerId}
//         onClick={onClickSendSubscriptionToPushServer}
//       >
//         {pushServerId
//           ? 'Subscrption sent to the server'
//           : 'Send subscription to push server'}
//       </button>

//       {pushServerId && (
//         <div>
//           <p>The server accepted the push subscrption!</p>
//           <button onClick={onClickSendNotification}>Send a notification</button>
//         </div>
//       )}

//       <section>
//         <h4>Your notification subscription details</h4>
//         <pre>
//           <code>{JSON.stringify(userSubscription, null, ' ')}</code>
//         </pre>
//       </section>
//     </main>
//   );
// };

// export default Test;
