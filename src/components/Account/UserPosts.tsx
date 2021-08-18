import axios from 'axios';
import React, { useEffect, FC, useState } from 'react';
import { useCookies } from 'react-cookie';
import { PostInterface } from '../../interfaces/posts/postInterfaces';
import Header from '../Header/Header';
import { checkUser } from './IsLogged/isLoggedUser';
import Post from '../Posts/Post';

const UserPosts: FC = () => {
  const [cookies] = useCookies();
  const { user } = cookies;
  const [posts, setPosts] = useState<PostInterface[]>();

  const getUserPosts = () => {
    axios
      .get(`${process.env.REACT_APP_API}/posts/user-posts?userId=${user._id}`)
      .then(res => setPosts(res.data));
  };

  useEffect(() => {
    checkUser(user);
    getUserPosts();
  }, []);

  return (
    <>
      {user && (
        <div>
          <Header />
          <p
            style={{
              color: 'var(--font-dark-600)',
              fontSize: '16px',
              marginLeft: '1rem',
            }}
          >
            Your posts
          </p>
          {posts?.map(
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
                  refreshPosts={getUserPosts}
                  date={date}
                />
              );
            }
          )}
        </div>
      )}
    </>
  );
};

export default UserPosts;
