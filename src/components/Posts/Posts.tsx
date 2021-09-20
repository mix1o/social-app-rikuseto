import { FC, useEffect, useState } from 'react';
import CreatePost from './CreatePost';
import Post from './Post';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { PostInterface } from '../../interfaces/posts/postInterfaces';
import { useCounter } from '../../store/sub';
import Header from '../Header/Header';
import { motion as m, AnimatePresence as Presence } from 'framer-motion';
import BlurredContent from '../Animations/Popup';

const Posts: FC = () => {
  const [posts, setPosts] = useState<PostInterface[]>();

  const [cookies] = useCookies();
  const { user } = cookies;

  const fetchPosts = (): void => {
    axios.get(`${process.env.REACT_APP_API}/posts/get`).then(res => {
      setPosts(res.data);
    });
  };

  const handleFetchPosts = (): void => {
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const [state, actions] = useCounter();

  return (
    <>
      <Header />
      <main>
        {user && !state.isOpenCommentComponent && (
          <div className="post__wrapper">
            <label className="post__container-input">
              <img
                className="post__image-author"
                src={user.avatar}
                alt={user.firstName}
              />
              <input
                disabled={state.open ? true : false}
                className="post__input"
                onClick={() => actions.openCreatePost(true)}
                type="text"
                placeholder={`${user.firstName}, what's is on your mind`}
              />
            </label>
          </div>
        )}
        <Presence>
          {state.open && (
            <BlurredContent closeHandler={() => actions.openCreatePost(false)}>
              <CreatePost handleFetchPosts={handleFetchPosts} />
            </BlurredContent>
          )}
        </Presence>

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
              />
            );
          }
        )}
      </main>
    </>
  );
};

export default Posts;
