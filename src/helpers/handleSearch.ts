import axios from 'axios';
import { CategoryArray } from '../interfaces/posts/category';
// import { PostInterface } from '../interfaces/posts/postInterfaces';
import { PostInterface } from '../interfaces/posts/postInterfaces';
import { CookieUser } from '../interfaces/auth/authInterface';

interface responseInterface {
  categories: Omit<CategoryArray, 'user_id'>[];
  posts: PostInterface[];
  users: CookieUser[];
}

export const handleFetch = async (
  value: string,
  limit: string
): Promise<{ data: responseInterface; status: number }> => {
  const params = new URLSearchParams();

  const response = await axios.get(`${process.env.REACT_APP_API}/search`, {
    params: {
      limit,
      q: value,
    },
  });
  console.log(response.status);
  return {
    data: response.data,
    status: response.status,
  };
};
