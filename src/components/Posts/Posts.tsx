import { FC, useEffect, useState } from 'react';
import CreatePost from './CreatePost';
import styled from 'styled-components';
import Post from './Post';
import axios from 'axios';

interface PostsProps {
  likes: string[];
  _id: string;
  user_id: string;
  headline: string;
  category: string;
  date: string;
  file: string;
  author: string;
}

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
  const [posts, setPosts] = useState<PostsProps[]>();
  const [open, setOpen] = useState<boolean>(false);

  const fetchPosts = (): void => {
    axios
      .get('http://localhost:8000/posts/get')
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
      <label>
        <input
          onClick={() => setOpen(true)}
          type="text"
          placeholder="What's on your mind"
        />
      </label>
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
      {posts?.map(
        ({ _id, headline, category, file, user_id, likes, date, author }) => {
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
              author={author}
            />
          );
        }
      )}
    </div>
  );
};

export default Posts;
