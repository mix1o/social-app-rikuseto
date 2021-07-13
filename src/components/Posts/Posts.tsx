import React, { FC, useEffect, useState } from 'react';
import CreatePost from './CreatePost';

interface Posts {
  likes: string[];
  _id: string;
  user_id: string;
  headline: string;
  category: string;
  date: string;
  file: string;
}

const Posts: FC = () => {
  const [posts, setPosts] = useState<Posts[]>();

  useEffect(() => {
    fetch('https://rikuseto-social.herokuapp.com/posts/get')
      .then(res => res.json())
      .then(json => setPosts(json));
  }, []);

  return (
    <div>
      <CreatePost />
      {posts?.map(({ headline, category, file, user_id }, idx) => {
        return (
          <div
            style={{ background: '#333', color: '#fff', textAlign: 'center' }}
            key={idx}
          >
            <p>{user_id}</p>
            <p>{headline}</p>
            <p>{category}</p>
            <img style={{ width: '90%', height: '200px' }} src={file} />
          </div>
        );
      })}
    </div>
  );
};

export default Posts;
