import { useActor } from '@xstate/react';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router';
import {
  createNewAccount,
  deleteAccount,
  loginUser,
  resetPassword,
} from '../api/auth';
import { authService } from '../components/Auth/AuthStateMachine';
import { AuthType } from '../enums/Auth';
import { CookieUser } from '../interfaces/auth/authInterface';
import useNotification from './useNotification';

export const useAuth = () => {
  const [, setCookie, removeCookie] = useCookies(); //add useUser
  const { push } = useHistory();
  const [, send] = useActor(authService);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    message: '',
    status: 0,
  });
  // move setMEssage to useCode hook, add styled compoennts
  const { subscribeToPushNotification } = useNotification();

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
    type: AuthType,
    user?: CookieUser
  ) => {
    setLoading(false);

    setMessage({
      message,
      status: status,
    });

    if (status === 200) {
      switch (type) {
        case AuthType.SIGN_IN:
          if (!user) return;
          setCookie('user', user, { path: '/' }); //change to hoook
          localStorage.setItem('userId', JSON.stringify({ id: user._id }));
          if (user.pushNotification) subscribeToPushNotification();
          if (window.location.href.includes('/auth')) push('/');

          break;
        case AuthType.SIGN_UP:
          setTimeout(() => {
            send('SIGN_IN');
          }, 2000);
          break;
        case AuthType.REMOVE_ACCOUNT:
          setTimeout(() => removeCookie('user'), 200);
          localStorage.removeItem('userId');
          push('/');
          break;
      }
    }
  };

  const handleError = (error: any) => {
    setMessage({ message: error.toString(), status: 999 });
    setLoading(false);
  };

  const { mutate: signUp, failureCount } = useMutation(
    ['sing-up'],
    createNewAccount,
    {
      onMutate: () => setLoading(true),
      onSuccess: data => {
        if (!data) return;

        checkResponse(data.status, data.data.message, AuthType.SIGN_UP);
      },
      onError: error => handleError(error),
    }
  );

  const { mutate: signIn } = useMutation(['sign-in'], loginUser, {
    onMutate: () => setLoading(true),
    onSuccess: data => {
      if (!data?.data) return;
      checkResponse(
        data.status,
        data.data.message,
        AuthType.SIGN_IN,
        data.data.user
      );
    },
    onError: error => handleError(error),
  });

  const { mutate: reset } = useMutation(['reset-password'], resetPassword, {
    onSuccess: data => {
      console.log(data);
    },
  });

  const { mutate: removeAccount } = useMutation(
    ['delete-account'],
    deleteAccount,
    {
      onMutate: () => setLoading(true),
      onSuccess: data => {
        if (!data) return;
        checkResponse(data.status, data.data.message, AuthType.REMOVE_ACCOUNT);
      },
      onError: error => handleError(error),
    }
  );
  //TODO password reset on front an dbackend

  return {
    signIn,
    loading,
    message,
    signUp,
    reset,
    removeAccount,
    failureCount,
  };
};
