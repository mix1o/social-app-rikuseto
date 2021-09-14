import { useActor } from '@xstate/react';
import { authService } from '../Auth/AuthStateMachine';
import SignIn from '../Auth/SignIn';
import SignUp from '../Auth/SignUp';
import ResetPassword from '../Auth/ResetPassword';
import React from 'react';

const BlurredMenu: React.FC<{
  setUserOption: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setUserOption }) => {
  const [current, send] = useActor(authService);

  return (
    <div data-testid="blurred" className="blurred__options">
      <div
        className="blurred__blurred-bg"
        onClick={() => {
          setUserOption(prevValue => !prevValue);
          send('SIGN_IN');
        }}
      ></div>

      <div className="blurred__option">
        {current.matches('signIn') && <SignIn />}
        {current.matches('signUp') && <SignUp />}
        {current.matches('resetPassword') && <ResetPassword />}
      </div>
    </div>
  );
};

export default BlurredMenu;
