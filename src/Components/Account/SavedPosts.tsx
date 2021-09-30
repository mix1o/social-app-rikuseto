import { useEffect, FC, useState, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { PostInterface } from '../../Interfaces/posts/postInterfaces';
import Post from '../Posts/Post';
import Header from '../Header/Header';
import { CookieUser } from '../../Interfaces/auth/authInterface';

const SavedPosts: FC = () => {
  const [cookies] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;

  const [posts, setPosts] = useState<PostInterface[]>();

  const handleFetchPosts = useCallback(() => {
    axios
      .get(`${process.env.REACT_APP_API}/posts/saved-posts?userId=${user._id}`)
      .then(res => setPosts(res.data));
  }, [user._id]);

  useEffect(() => {
    handleFetchPosts();
  }, [handleFetchPosts]);

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
