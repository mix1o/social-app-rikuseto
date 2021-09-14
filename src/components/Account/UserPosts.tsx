import axios from 'axios';
import { useEffect, FC, useState, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { PostInterface } from '../../interfaces/posts/postInterfaces';
import Header from '../Header/Header';
import Post from '../Posts/Post';
import { CookieUser } from '../../interfaces/auth/authInterface';

const UserPosts: FC = () => {
  const [cookies] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;
  const [posts, setPosts] = useState<PostInterface[]>();

  const getUserPosts = useCallback(() => {
    axios
      .get(`${process.env.REACT_APP_API}/posts/user-posts?userId=${user._id}`)
      .then(res => setPosts(res.data));
  }, [user._id]);

  useEffect(() => {
    getUserPosts();
  }, [getUserPosts]);

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
