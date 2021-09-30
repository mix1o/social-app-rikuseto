import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router';
import { BaseUserData, CookieUser } from '../Interfaces/auth/authInterface';

interface ISignInResponse {
  message: string;
  user?: CookieUser;
}

export const useAuth = () => {
  const [, setCookie] = useCookies();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  const checkResponse = (
    status: number,
    message: string,
    user?: CookieUser
  ) => {
    setLoading(false);
    if (status === 203) return { message: message, status: status };

    if (status === 200) {
      setCookie('user', user, { path: '/' });

      if (window.location.href.includes('/auth')) history.push('/');

      setTimeout(() => {
        window.location.reload();
      }, 500);
      return { message: message, status: status };
    }
    return { message: message, status: status };
  };

  const signIn = async (values: BaseUserData) => {
    const params = new URLSearchParams({
      email: values.email,
      password: values.password,
    });
    setLoading(true);
    try {
      const {
        status,
        data: { message, user },
      }: AxiosResponse<ISignInResponse> = await axios.get(
        `${process.env.REACT_APP_API}/auth?${params.toString()}`
      );
      const result = checkResponse(status, message, user);

      return result;
    } catch (err: any) {
      return {
        error: err,
      };
    }
  };

  return {
    signIn,
    loading,
  };
};
