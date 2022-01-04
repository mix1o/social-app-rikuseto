import axios from 'axios';
import { useEffect, FC, useState, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { PostInterface } from '../../interfaces/posts/postInterfaces';
import Header from '../../components/Header/Header';
import Post from '../Post/Post';
import { CookieUser } from '../../interfaces/auth/authInterface';
// import { useUserPosts } from '../../hooks/usePost';

const UserPosts: FC = () => {
  const [cookies] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;
  const [posts, setPosts] = useState<PostInterface[]>();

  // const { data } = useUserPosts({ userId: user._id });
  // console.log(data);
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
          {/* {data?.map(
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
                  date={date}
                />
              );
            }
          )} */}
        </div>
      )}
    </>
  );
};

export default UserPosts;
