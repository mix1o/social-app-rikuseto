import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Header from '../Header/Header';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link } from 'react-router-dom';
import { CookieUser } from '../../Interfaces/auth/authInterface';
import Loading from '../Animations/Loading';

interface NotificationsI {
  friendsRequests: [
    {
      avatar: string;
      firstName: string;
      lastName: string;
      request: {
        date: string;
        requestedUser: string;
        status: string;
        userId: string;
        _id: string;
      };
    }
  ];
  notifications: [
    {
      body: string;
      date: string;
      header: string;
      photo: string;
      state: number;
      status: boolean;
      url: string;
      userId: string;
      _id: string;
    }
  ];
}

type Option = 'accept' | 'decline';

const Notifications = () => {
  const [cookies, setCookie] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;
  const [notifications, setNotifications] = useState<NotificationsI>();
  const [loading, setLoading] = useState(true);
  dayjs.extend(relativeTime);

  const getAllNotifications = () => {
    axios
      .get(`${process.env.REACT_APP_API}/user/get-requests?id=${user._id}`)
      .then(res => {
        setNotifications(res.data);
        setLoading(false);
      });
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
        if (res.data.updateUser)
          setCookie('user', res.data.updateUser, { path: '/' });
        getAllNotifications();
      });
  };

  useEffect(() => {
    getAllNotifications();
  }, []);

  const changeStatus = (id: string, status: boolean) => {
    if (!status)
      return axios
        .put(`${process.env.REACT_APP_API}/user/notification-status?id=${id}`)
        .then(res => console.log(res.data));
  };

  return (
    <>
      <Header />
      {loading && <Loading />}
      <div className="notifications">
        {notifications &&
          notifications.friendsRequests.length < 1 &&
          notifications.notifications.length < 1 &&
          !loading && (
            <p className="notifications__message">
              You don't have any notifications yet.
            </p>
          )}
        <div className="notifications__items">
          {notifications?.friendsRequests.map(
            (
              {
                avatar,
                firstName,
                lastName,
                request: { status, date, _id, userId },
              },
              idx
            ) => {
              return (
                <div
                  key={idx}
                  className={`notifications__request ${
                    status ? 'notifications__request--active' : ''
                  }`}
                >
                  <div className="notifications__view">
                    <div className="notifications__container-img">
                      <img
                        className="notifications__img"
                        src={avatar}
                        alt="user profile"
                      />
                    </div>
                    <div className="notifications__info">
                      <p className="notifications__header">
                        Friend request from{' '}
                        <span>
                          {firstName} {lastName}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="notifications__action">
                    <div className="notifications__container-btn">
                      <button
                        className="notifications__btn notifications__btn--reject"
                        onClick={() => optionRequest('decline', _id, userId)}
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => optionRequest('accept', _id, userId)}
                        className="notifications__btn"
                      >
                        Accept
                      </button>
                    </div>
                    <p className="notifications__status">Status: {status}</p>
                    <p className="notifications__date">
                      {dayjs(date).fromNow()}
                    </p>
                  </div>
                </div>
              );
            }
          )}
        </div>
        <div className="notifications__elements">
          {notifications?.notifications
            .reverse()
            .map(({ body, date, header, photo, status, url, _id }, idx) => {
              let displayImg = false;

              if (url.includes('#')) displayImg = true;

              return (
                <div
                  style={!status ? { background: 'rgba(66, 44, 84, 0.8)' } : {}}
                  key={idx}
                  className={`notifications__request ${
                    status ? 'notifications__request--active' : ''
                  }
                  ${!displayImg ? 'notifications__requests--padding' : ''}
                  `}
                >
                  <Link
                    onClick={() => changeStatus(_id, status)}
                    className="notifications__link"
                    to={`/${url}`}
                  >
                    <div className="notifications__view">
                      {displayImg && (
                        <div className="notifications__container-img">
                          <img
                            className="notifications__img"
                            src={photo}
                            alt="user profile"
                          />
                        </div>
                      )}
                      <div className="notifications__info">
                        <p className="notifications__header">{header}</p>
                      </div>
                    </div>

                    <div
                      className={`notifications__action ${
                        displayImg ? 'notifications__action--lower' : ''
                      }`}
                    >
                      <p className="notifications__body">{body}</p>
                      <p className="notifications__date">
                        {dayjs(date).fromNow()}
                      </p>
                    </div>
                  </Link>
                  <i className="fas fa-ellipsis-v " />
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Notifications;
