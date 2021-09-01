import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';

interface NotificationsI {
  avatar: string;
  first_name: string;
  last_name: string;
  request: {
    date: string;
    requestedUser: string;
    status: string;
    userId: string;
    _id: string;
  };
}
type Option = 'accept' | 'decline';

const Notifications = () => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const { user } = cookies;
  const [notifications, setNotifications] = useState<NotificationsI[]>([]);

  const getAllNotifications = () => {
    axios
      .get(`${process.env.REACT_APP_API}/user/get-requests?id=${user._id}`)
      .then(res => setNotifications(res.data));
  };

  const optionRequest = (
    option: Option,
    requestId: string,
    friendId: string
  ) => {
    axios
      .post(`${process.env.REACT_APP_API}/user/accept-request`, {
        result: option,
        requestId,
        userId: user._id,
        friendId,
      })
      .then(res => {
        setCookie('user', res.data.updateUser);
      });
  };

  useEffect(() => {
    getAllNotifications();
  }, []);

  console.log(user);
  return (
    <div>
      <h1>Hello {user.first_name}</h1>
      {notifications?.map(({ avatar, first_name, last_name, request }, idx) => {
        return (
          <div key={idx}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}
            >
              <img
                style={{ width: '20px', height: '20px', borderRadius: '100px' }}
                src={avatar}
                alt="avatar"
              />
              <h4>
                {first_name} {last_name} wants to add you
              </h4>
              <h3>{request.status}</h3>
              <button
                onClick={() =>
                  optionRequest('accept', request._id, request.userId)
                }
              >
                Accept
              </button>
              <button
                onClick={() =>
                  optionRequest('decline', request._id, request.userId)
                }
              >
                Decline
              </button>
            </div>
            <h4>ThIS IS REQUEST ID {request._id}</h4>
          </div>
        );
      })}
    </div>
  );
};

export default Notifications;
