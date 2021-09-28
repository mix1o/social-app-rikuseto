import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../Header/Header';
import { CookieUser } from '../../interfaces/auth/authInterface';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

interface Friends {
  firstName: string;
  lastName: string;
  avatar: string;
  roomId: string;
}

const Conversations = () => {
  const [cookies] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;

  const [friends, setFriends] = useState<Friends[]>();

  const getFriends = () => {
    axios
      .get(`${process.env.REACT_APP_API}/user/friends?userId=${user._id}`)
      .then(res => setFriends(res.data.friends));
  };

  useEffect(() => {
    getFriends();
  }, []);

  return (
    <>
      <Header />
      {friends ? (
        <div className="conversations">
          {friends?.map(({ avatar, firstName, lastName, roomId }) => {
            return (
              <Link
                key={roomId}
                className="conversations__single"
                to={`/single-conversation/${roomId}/${firstName} ${lastName}`}
              >
                <div className="conversations__container-img">
                  <img className="conversations__img" src={avatar} alt="user" />
                </div>
                <div>
                  <p className="conversations__friend-name">
                    {firstName} {lastName}
                  </p>
                  <p className="conversations__last-msg">
                    {firstName}: Last message
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="conversations__single">
          <div className="conversations__container-img">
            <SkeletonTheme
              color="var(--light-bg-700)"
              highlightColor="var(--light-bg-600)"
            >
              <Skeleton
                style={{
                  borderRadius: '100%',
                  height: '35px',
                  width: '35px',
                }}
              />
            </SkeletonTheme>
          </div>
          <div
            className="conversation__skeleton-name"
            style={{ marginLeft: '2rem' }}
          >
            <SkeletonTheme
              color="var(--light-bg-700)"
              highlightColor="var(--light-bg-600)"
            >
              <Skeleton
                width={150}
                height={8}
                style={{ marginBottom: '.5rem' }}
              />
            </SkeletonTheme>
            <SkeletonTheme
              color="var(--light-bg-700)"
              highlightColor="var(--light-bg-600)"
            >
              <Skeleton width={150} height={8} />
            </SkeletonTheme>
          </div>
        </div>
      )}
    </>
  );
};

export default Conversations;
