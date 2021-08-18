import React, { useEffect, FC, useState } from 'react';
import { checkUser } from './IsLogged/isLoggedUser';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { PostInterface } from '../../interfaces/posts/postInterfaces';
import Post from '../Posts/Post';
import Header from '../Header/Header';

const SavedPosts: FC = () => {
  const [cookies] = useCookies();
  const { user } = cookies;
  const [posts, setPosts] = useState<PostInterface[]>();

  const handleFetchPosts = () => {
    axios
      .get(`${process.env.REACT_APP_API}/posts/saved-posts?userId=${user._id}`)
      .then(res => setPosts(res.data));
  };

  useEffect(() => {
    checkUser(user);
    handleFetchPosts();
  }, []);

  return (
    <>
      <Header />
      {user && (
        <div>
          <p
            style={{
              color: 'var(--font-dark-600)',
              fontSize: '16px',
              marginLeft: '1rem',
            }}
          >
            Your saved posts
            <i className="fas fa-flag" style={{ marginLeft: '1rem' }} />
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
                  refreshPosts={handleFetchPosts}
                  date={date}
                  saved={true}
                />
              );
            }
          )}
          <p
            style={{
              color: 'var(--font-dark-300)',
              textAlign: 'center',
              fontSize: '13px',
              marginTop: '3rem',
              marginBottom: '6rem;',
            }}
          >
            No more content to load
          </p>
        </div>
      )}
    </>
  );
};

export default SavedPosts;
