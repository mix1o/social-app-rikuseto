import { FC } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { useService } from '@xstate/react';
import { authService } from './AuthStateMachine';
import ResetPassword from './ResetPassword';

const Auth: FC = () => {
  const [current] = useService(authService);

  return (
    <>
      <div>{current.matches('signIn') && <SignIn />}</div>
      <div>{current.matches('signUp') && <SignUp />}</div>
      <div>{current.matches('resetPassword') && <ResetPassword />}</div>
    </>
  );
};

export default Auth;
