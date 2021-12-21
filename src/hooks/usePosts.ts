import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { PostInterface } from '../interfaces/posts/postInterfaces';

export const usePosts = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<PostInterface[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/posts/get`
      );

      setPosts(response.data);
      setLoading(false);
    })();
  }, []);

  return { posts, loading };
};

export const sortPosts = () => {
  return 1;
};

// const fetchPosts = (): void => {
//   let url = '';

//   console.log('dupa');
//   if (postTypes === MODE_ALL) url = '/posts/get';
//   if (postTypes === MODE_HOME && user)
//     url = `/posts/get-categories?id=${user._id}`;

//   axios.get(`${process.env.REACT_APP_API}${url}`).then(res => {
//     setPosts(res.data);
//   });
// };
