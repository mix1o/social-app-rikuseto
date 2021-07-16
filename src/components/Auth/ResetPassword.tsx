import { FC } from 'react';
import { useMachine } from '@xstate/react';
import { AuthStateMachine } from './AuthStateMachine';

const ResetPassword: FC = () => {
  const [, send] = useMachine(AuthStateMachine);
  return (
    <div>
      Teraz jest reset
      <button onClick={() => send('SIGN_IN')}>Login</button>
      <button onClick={() => send('SIGN_UP')}>SIGN_UP</button>
    </div>
  );
};

export default ResetPassword;
