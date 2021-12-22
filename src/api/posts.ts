import axios from 'axios';

export const fetchPosts = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API}/posts/get`);

  return response.data;
};

//TODO: export functions (sortPosts etc)
