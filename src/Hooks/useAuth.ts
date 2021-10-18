import { useActor } from '@xstate/react';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router';
import { authService } from '../components/Auth/AuthStateMachine';
import {
  BaseUserData,
  CookieUser,
  CreateUser,
  IMessage,
} from '../interfaces/auth/authInterface';

interface ISignInResponse {
  message: string;
  user?: CookieUser;
}

export const useAuth = () => {
  const [, setCookie, removeCookie] = useCookies();
  const history = useHistory();
  const [, send] = useActor(authService);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<IMessage>({
    message: '',
    status: 0,
  });

  useEffect(() => {
    return () => {
      setLoading(false);
      setMessage({
        message: '',
        status: 0,
      });
    };
  }, []);

  const checkResponse = (
    status: number,
    message: string,
    user?: CookieUser
  ) => {
    setLoading(false);

    if (status === 200) {
      if (user) setCookie('user', user, { path: '/' });

      if (window.location.href.includes('/auth')) history.push('/');

      setTimeout(() => {
        window.location.reload();
      }, 500);
      setMessage({ message: message, status: status });
    }
    setMessage({ message: message, status: status });
  };

  const signIn = async (values: BaseUserData) => {
    setLoading(true);

    try {
      const {
        status,
        data: { message, user },
      }: AxiosResponse<ISignInResponse> = await axios.post(
        `${process.env.REACT_APP_API}/auth/login`,
        values
      );

      checkResponse(status, message, user);
    } catch (err: any) {
      setMessage({ message: err, status: err.status });
    }
  };

  const signUp = async (values: CreateUser) => {
    setLoading(true);
    try {
      const {
        data: { message },
        status,
      }: AxiosResponse<IMessage> = await axios.post(
        `${process.env.REACT_APP_API}/auth/create-account`,
        values
      );

      setMessage({
        message,
        status,
      });

      if (status === 200) {
        setTimeout(() => {
          send('SIGN_IN');
        }, 2000);
      }
    } catch (err: any) {
      setMessage({ message: err, status: err.status });
    }
  };

  const removeAccount = async ({
    email,
    password,
    userId,
  }: {
    email: string;
    password: string;
    userId: string;
  }) => {
    setLoading(true);

    try {
      const {
        status,
        data: { message },
      }: AxiosResponse<IMessage> = await axios.delete(
        `${process.env.REACT_APP_API}/auth`,
        {
          params: {
            email,
            password,
            userId,
          },
        }
      );
      setMessage({ message, status });
      setLoading(false);
      if (status === 200) {
        setTimeout(() => removeCookie('user'), 200);
        history.push('/');
      }
    } catch (err: any) {
      setMessage({ message: err, status: err.status });
    }
  };

  return {
    signIn,
    loading,
    message,
    signUp,
    removeAccount,
  };
};
