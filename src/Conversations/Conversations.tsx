import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header/Header';

interface Friends {
  first_name: string;
  last_name: string;
  avatar: string;
  roomId: string;
}

const Conversations = () => {
  const [cookies] = useCookies();
  const { user } = cookies;

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
      <div className="conversations">
        {friends?.map(({ avatar, first_name, last_name, roomId }) => {
          return (
            <Link
              key={roomId}
              className="conversations__single"
              to={`/single-conversations/${roomId}/${first_name} ${last_name}`}
            >
              <div className="conversations__container-img">
                <img
                  className="conversations__img"
                  src={avatar}
                  alt="user-image"
                />
              </div>
              <div>
                <p className="conversations__friend-name">
                  {first_name} {last_name}
                </p>
                <p className="conversations__last-msg">
                  {first_name}: Last message
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Conversations;
