import axios from 'axios';
import { FC, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CommentsData } from '../../Interfaces/comments/commentsInterfaces';
import { PostInterface } from '../../Interfaces/posts/postInterfaces';
import Header from '../Header/Header';
import Post from '../Posts/Post';
import Comment from '../Comments/Comment/Comment';
import { useCookies } from 'react-cookie';
import { CookieUser } from '../../Interfaces/auth/authInterface';

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

const Profile: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cookies, setCookie] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;

  const [profile, setProfile] = useState<ProfileI>();
  const [option, setOption] = useState<string>('posts');
  const [isFriend, setIsFriend] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const MODE_POSTS = 'posts';
  const MODE_COMMENTS = 'comments';
  const [isReq, setIsReq] = useState(false);
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

  const hasRequests = (person: any) => {
    person.requests.forEach((request: any) => {
      if (request.userId.toString() === id.toString()) {
        setIsReq(true);
      }
    });
  };

  useEffect(() => {
    getUserData();

    if (user) {
      checkIsFriend();
      isSentRequest(user);
    }
    return () => {
      setIsReq(false);
    };
  }, []);

  const handleAddToFriend = () => {
    setDisabled(true);
    const usersIds = {
      userId: user._id,
      friendId: profile?.user.id,
    };

    axios
      .post(`${process.env.REACT_APP_API}/user/add-friend`, usersIds)
      .then(res => {
        if (res.status === 200) {
          setCookie('user', res.data.user, { path: '/' });
          isSentRequest(res.data.user);
        }
      });
  };

  const checkIsFriend = () => {
    axios
      .get(`${process.env.REACT_APP_API}/user/get-current?id=${user._id}`)
      .then(res => {
        if (res.status === 200) {
          setCookie('user', res.data.user, { path: '/' });
          validateFriend(res.data.user);
          hasRequests(res.data.user);
        }
      });
  };

  const isSentRequest = (person: any) => {
    if (person.sentRequests) {
      person.sentRequests.forEach((request: any) => {
        if (request.requestedUser === id) {
          setIsSent(true);
        }
      });
    }
  };

  const validateFriend = (person: any) => {
    if (person.friends.length >= 1) {
      person.friends.forEach((friend: any) => {
        if (friend.friendId === id) {
          setIsFriend(true);
          setIsSent(false);
        }
      });
    }
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

            {!isSent && !isReq && !isFriend && (
              <button
                className="profile__add"
                disabled={disabled}
                onClick={handleAddToFriend}
              >
                Add to friend
              </button>
            )}
            {isSent && (
              <span className="profile__status">An invitation was sent</span>
            )}
            {isReq && (
              <span className="profile__status">Check your notification</span>
            )}
            {isFriend && (
              <span className="profile__status">You are friends</span>
            )}
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
            {profile?.posts?.length === 0 && (
              <p className="profile__info">This user has no posts yet</p>
            )}
            {profile?.posts?.map(
              ({ _id, headline, category, file, userId, likes, date }) => {
                return (
                  <Post
                    key={_id}
                    _id={_id}
                    headline={headline}
                    category={category}
                    file={file}
                    userId={userId}
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
            {profile?.comments?.length === 0 && (
              <p className="profile__info">This user has no comments yet</p>
            )}
            {profile?.comments.map(({ _id, text, userId, likes, date }) => {
              return (
                <Comment
                  key={_id}
                  _id={_id}
                  text={text}
                  userId={userId}
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
