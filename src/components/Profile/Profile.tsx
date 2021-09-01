import axios from 'axios';
import React, { FC, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CommentsData } from '../../interfaces/comments/commentsInterfaces';
import { PostInterface } from '../../interfaces/posts/postInterfaces';
import Header from '../Header/Header';
import Post from '../Posts/Post';
import Comment from '../Comments/Comment/Comment';
import { useCookies } from 'react-cookie';

interface UserDataInterface {
  id: string;
  avatar: string;
  firstName: string;
  lastName: string;
  date: string;
}

interface ProfileI {
  user: UserDataInterface;
  posts: PostInterface[];
  comments: CommentsData[];
}

interface FriendI {
  friendId: string;
  roomId: string;
  userId: string;
}

const Profile: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cookies, setCookie] = useCookies();
  const { user } = cookies;

  const [profile, setProfile] = useState<ProfileI>();
  const [option, setOption] = useState<string>('posts');

  const [isSent, setIsSent] = useState(false);
  const MODE_POSTS = 'posts';
  const MODE_COMMENTS = 'comments';

  const getUserData = () => {
    axios.get(`${process.env.REACT_APP_API}/profile?userId=${id}`).then(res => {
      setProfile(res.data);
    });
  };

  const formatDate = () => {
    let combineDate;

    if (profile?.user) {
      let date = new Date(profile!.user!.date);

      let year = date.getFullYear();
      let month: string | number = date.getMonth() + 1;
      let day: string | number = date.getDate();

      if (day < 10) day = `0${day}`;
      if (month < 10) month = `0${month}`;

      combineDate = `${day}/${month}/${year}`;
      return combineDate;
    }
  };

  useEffect(() => {
    getUserData();
    if (user) {
      checkIsFriend();
      isSentRequest();
    }
  }, [user]);

  const handleAddToFriend = () => {
    const usersIds = {
      userId: user._id,
      friendId: profile?.user.id,
    };

    axios
      .post(`${process.env.REACT_APP_API}/user/add-friend`, usersIds)
      .then(res => {
        setCookie('user', res.data.user);
        console.log(res.data.user);
        isSentRequest();
      });
  };
  // TODO Delete sent_requests
  const checkIsFriend = () => {
    axios
      .get(`${process.env.REACT_APP_API}/user/get-current?id=${user._id}`)
      .then(res => {
        setCookie('user', res.data.user);
        validateFriend();
      });
  };

  const isSentRequest = () => {
    user.sent_requests.forEach((request: any) => {
      if (request.requestedUser == id) {
        setIsSent(true);
      }
    });
  };

  const [isFriend, setIsFriend] = useState(false);
  const validateFriend = () => {
    user.friends.forEach((friend: any) => {
      if (friend.friendId == id) {
        setIsFriend(true);
        setIsSent(false);
      }
    });
  };

  return (
    <>
      <Header />

      <div className="profile">
        <div className="profile__user">
          <img
            src={profile?.user?.avatar}
            className="profile__image"
            alt="Avatar"
          />
          <p className="profile__name">
            {profile?.user.firstName} {profile?.user.lastName}
          </p>
          <div className="profile__info">
            <p className="profile__date">Joined: {formatDate()}</p>
            <p className="profile__total">
              Total posts: {profile?.posts.length}
            </p>

            {!isSent && !isFriend && (
              <button onClick={handleAddToFriend}>Add to friend</button>
            )}
            {isSent && <h1>PENDING</h1>}
            {isFriend && <h1>You are friends</h1>}
          </div>
        </div>
        <div className="profile__choice">
          <button
            className={`profile__btn ${
              option === MODE_POSTS ? 'profile__btn--active' : ''
            }`}
            onClick={() => setOption(MODE_POSTS)}
          >
            Posts
          </button>
          <button
            className={`profile__btn ${
              option === MODE_COMMENTS ? 'profile__btn--active' : ''
            }`}
            onClick={() => setOption(MODE_COMMENTS)}
          >
            Comments
          </button>
        </div>
        {option === MODE_POSTS && (
          <div>
            {profile?.posts?.map(
              ({ _id, headline, category, file, user_id, likes, date }) => {
                return (
                  <Post
                    key={_id}
                    _id={_id}
                    headline={headline}
                    category={category}
                    file={file}
                    user_id={user_id}
                    likes={likes}
                    refreshPosts={getUserData}
                    date={date}
                  />
                );
              }
            )}
          </div>
        )}
        {option === MODE_COMMENTS && (
          <div className="profile__comments">
            {profile?.comments.map(({ _id, text, user_id, likes, date }) => {
              return (
                <Comment
                  key={_id}
                  _id={_id}
                  text={text}
                  user_id={user_id}
                  likes={likes}
                  date={date}
                  refreshComments={getUserData}
                  fetchTopComment={() => {}}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
