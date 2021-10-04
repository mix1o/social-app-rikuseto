import { FC, useEffect } from 'react';
import { useActor } from '@xstate/react';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import { authService } from '../Components/Auth/AuthStateMachine';
import { CookieUser } from '../Interfaces/auth/authInterface';
import SignIn from '../Components/Auth/SignIn';
import SignUp from '../Components/Auth/SignUp';
import ResetPassword from '../Components/Auth/ResetPassword';

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
