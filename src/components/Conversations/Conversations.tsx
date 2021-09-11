import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../Header/Header';

interface Friends {
  firstName: string;
  lastName: string;
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
    </>
  );
};

export default Conversations;
