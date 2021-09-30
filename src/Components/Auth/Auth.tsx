import { FC, useEffect } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { useActor } from '@xstate/react';
import { authService } from './AuthStateMachine';
import ResetPassword from './ResetPassword';
import { useCookies } from 'react-cookie';
import { CookieUser } from '../../Interfaces/auth/authInterface';
import { useHistory } from 'react-router-dom';

const Auth: FC = () => {
  const [current] = useActor(authService);

  const [cookies] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;
  const history = useHistory();

  useEffect(() => {
    if (user) history.push('/');
  }, []);

  return (
    <div className="auth">
      {current.matches('signIn') && <SignIn />}
      {current.matches('signUp') && <SignUp />}
      {current.matches('resetPassword') && <ResetPassword />}
    </div>
  );
};

export default Auth;
