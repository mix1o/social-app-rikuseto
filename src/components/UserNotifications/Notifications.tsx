import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Header from '../Header/Header';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link } from 'react-router-dom';

interface NotificationsI {
  friendsRequests: [
    {
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
      user_id: string;
      _id: string;
    }
  ];
}

type Option = 'accept' | 'decline';

const Notifications = () => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const { user } = cookies;
  const [notifications, setNotifications] = useState<NotificationsI>();
  dayjs.extend(relativeTime);
  const getAllNotifications = () => {
    axios
      .get(`${process.env.REACT_APP_API}/user/get-requests?id=${user._id}`)
      .then(res => setNotifications(res.data));
  };

  console.log(notifications);
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
        getAllNotifications();
      });
  };

  useEffect(() => {
    getAllNotifications();
  }, []);

  return (
    <>
      <Header />
      <div className="notifications">
        <div className="notifications__items">
          {notifications?.friendsRequests.map(
            (
              {
                avatar,
                first_name,
                last_name,
                request: { status, requestedUser, date, _id, userId },
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
                        alt="photo"
                      />
                    </div>
                    <div className="notifications__info">
                      <p className="notifications__header">
                        Friend request from{' '}
                        <span>
                          {first_name} {last_name}
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
          {notifications?.notifications.map(
            (
              { body, date, header, photo, state, status, url, user_id, _id },
              idx
            ) => {
              let displayImg = false;

              if (url.includes('#')) displayImg = true;

              return (
                <div
                  key={idx}
                  className={`notifications__request ${
                    status ? 'notifications__request--active' : ''
                  }
                  ${!displayImg ? 'notifications__requests--padding' : ''}
                  `}
                >
                  <Link className="notifications__link" to={`/${url}`}>
                    <div className="notifications__view">
                      {displayImg && (
                        <div className="notifications__container-img">
                          <img
                            className="notifications__img"
                            src={photo}
                            alt="photo"
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
            }
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;

{
  /* <div className="notifications__info">
                      {displayImg && (
                        <img
                          className="notifications__img"
                          src={photo}
                          alt="photo"
                        />
                      )}
                      <p className="notifications__header notifications__header--lower">
                        {header}
                        <span className="notifications__date">
                          {dayjs(date).fromNow()}
                        </span>
                      </p>
                      <i className="fas fa-ellipsis-v"></i>
                    </div>
                    <div className="notifications__redirect">
                      <p className="notifications__body">{body}</p>
                    </div> */
}
