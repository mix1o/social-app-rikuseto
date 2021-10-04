import axios from 'axios';
import { CategoryArray } from '../Interfaces/posts/category';
import { PostInterface } from '../Interfaces/posts/postInterfaces';
import { CookieUser } from '../Interfaces/auth/authInterface';

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
