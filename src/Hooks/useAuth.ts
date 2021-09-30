import { useActor } from '@xstate/react';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router';
import { Event, SingleOrArray } from 'xstate';
import {
  authService,
  MachineEvents,
} from '../Components/Auth/AuthStateMachine';
import { createParams } from '../Helpers/createParams';
import {
  BaseUserData,
  CookieUser,
  CreateUser,
  IMessage,
} from '../Interfaces/auth/authInterface';

interface ISignInResponse {
  message: string;
  user?: CookieUser;
}

export const useAuth = () => {
  const [, setCookie] = useCookies();
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

    const params = createParams(values);

    try {
      const {
        status,
        data: { message, user },
      }: AxiosResponse<ISignInResponse> = await axios.get(
        `${process.env.REACT_APP_API}/auth?${params}`
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
        `${process.env.REACT_APP_API}/auth`,
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
    } catch (err) {
      return {};
    }
  };

  return {
    signIn,
    loading,
    message,
    signUp,
  };
};
