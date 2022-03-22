import { useCookies } from 'react-cookie';
import { CookieUser } from '../interfaces/auth/authInterface';

//WARNING maybe its better to define interface here

export const useUser = () => {
  const [cookies, setCookie] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;

  return {
    user,
    setCookie, //It can be useful later
  };
};
