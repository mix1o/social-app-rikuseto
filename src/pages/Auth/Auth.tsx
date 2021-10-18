import { FC, useEffect } from 'react';
import { useActor } from '@xstate/react';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import { authService } from '../../components/Auth/AuthStateMachine';
import { CookieUser } from '../../interfaces/auth/authInterface';
import SignIn from '../../components/Auth/SignIn';
import SignUp from '../../components/Auth/SignUp';
import ResetPassword from '../../components/Auth/ResetPassword';

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
