import { FC } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { useMachine } from '@xstate/react';
import { AuthStateMachine } from './AuthStateMachine';
import ResetPassword from './ResetPassword';

const Auth: FC = () => {
  const [current, send] = useMachine(AuthStateMachine);
  // TODO Fix this fucking pice of shit, cannot call hook outside fucntion body HOW !??!?!?!???!?!?!?

  return (
    <>
      {/* <SignIn/> */}
      <SignUp />

      {/* <div>{current.matches('signIn') && <SignIn />}</div>
      <div>{current.matches('signUp') && <SignUp />}</div>
      <div>{current.matches('resetPassword') && <ResetPassword />}</div> */}
    </>
  );
};

export default Auth;
