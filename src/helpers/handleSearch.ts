import axios from 'axios';
import { CategoryArray } from '../interfaces/posts/category';
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
): Promise<responseInterface | undefined> => {
  try {
    const params = new URLSearchParams({
      limit,
      q: value,
    });

    const response = await axios.get(
      `${process.env.REACT_APP_API}/search?${params.toString()}`
    );

    return response.data;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};
