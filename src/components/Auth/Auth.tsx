import { FC } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { useService } from '@xstate/react';
import { authService } from './AuthStateMachine';
import ResetPassword from './ResetPassword';

const Auth: FC = () => {
  const [current] = useService(authService);

  return (
    <div className="auth">
      {current.matches('signIn') && <SignIn />}
      {current.matches('signUp') && <SignUp />}
      {current.matches('resetPassword') && <ResetPassword />}
    </div>
  );
};

export default Auth;
