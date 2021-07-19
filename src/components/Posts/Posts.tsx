import { FC, useEffect, useState } from 'react';
import CreatePost from './CreatePost';
import styled from 'styled-components';
import Post from './Post';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { PostInterface } from '../../interfaces/posts/postInterfaces';

const ContainerNewPost = styled.div`
  width: 100%;
  height: 100vh;
  padding: 2rem;
  text-align: center;
  z-index: 10;
  position: fixed;
  top: 0;
  left: 0;
  background: #333;
`;

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

  return (
    <div>
      {user && (
        <label className="post__container-input">
          <img
            className="post__image-author"
            src={user.avatar}
            alt={user.first_name}
          />
          <input
            className="post__input"
            onClick={() => setOpen(true)}
            type="text"
            placeholder={`${user.first_name}, what's is on your mind`}
          />
        </label>
      )}
      {open && (
        <ContainerNewPost>
          <div
            onClick={() => setOpen(false)}
            style={{ textAlign: 'right', color: '#000' }}
          >
            x
          </div>
          <CreatePost handleFetchPosts={handleFetchPosts} setOpen={setOpen} />
        </ContainerNewPost>
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
    </div>
  );
};

export default Posts;
