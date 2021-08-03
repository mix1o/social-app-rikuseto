import { FC, useEffect, useState } from 'react';
import CreatePost from './CreatePost';
import Post from './Post';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { PostInterface } from '../../interfaces/posts/postInterfaces';
import { useCounter } from '../../store/sub';

const Posts: FC = () => {
  const [posts, setPosts] = useState<PostInterface[]>();
  const [open, setOpen] = useState<boolean>(false);

  const [cookies] = useCookies();
  const { user } = cookies;

  const fetchPosts = (): void => {
    axios
      .get(`${process.env.REACT_APP_API}/posts/get`)
      .then(res => setPosts(res.data));
  };

  const handleFetchPosts = (): void => {
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const [state, actions] = useCounter();

  // TODO COMMENTS Popup
  return (
    <main
      style={
        state.isOpenCommentComponent
          ? { overflowY: 'hidden', height: '10vh' }
          : {}
      }
    >
      {user && (
        <div className="post__wrapper">
          <label className="post__container-input">
            <img
              className="post__image-author"
              src={user.avatar}
              alt={user.first_name}
            />
            <input
              disabled={open ? true : false}
              className="post__input"
              onClick={() => setOpen(true)}
              type="text"
              placeholder={`${user.first_name}, what's is on your mind`}
            />
          </label>
        </div>
      )}
      {open && (
        <CreatePost handleFetchPosts={handleFetchPosts} setOpen={setOpen} />
      )}
      {posts?.map(({ _id, headline, category, file, user_id, likes, date }) => {
        return (
          <Post
            key={_id}
            _id={_id}
            headline={headline}
            category={category}
            file={file}
            user_id={user_id}
            likes={likes}
            onClickLike={handleFetchPosts}
            date={date}
          />
        );
      })}
    </main>
  );
};

export default Posts;
