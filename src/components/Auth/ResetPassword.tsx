import { FC } from 'react';
import { useMachine, useService } from '@xstate/react';
import { AuthStateMachine, authService } from './AuthStateMachine';

const ResetPassword: FC = () => {
  const [, send] = useService(authService);
  return (
    <div>
      Teraz jest reset
      <button onClick={() => send('SIGN_IN')}>Login</button>
      <button onClick={() => send('SIGN_UP')}>SIGN_UP</button>
    </div>
  );
};

export default ResetPassword;
