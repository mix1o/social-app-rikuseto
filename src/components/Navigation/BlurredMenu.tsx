import { useActor } from '@xstate/react';
import { authService } from '../Auth/AuthStateMachine';
import SignIn from '../Auth/SignIn';
import SignUp from '../Auth/SignUp';
import ResetPassword from '../Auth/ResetPassword';
import React from 'react';

interface Blur {
  setUserOption: React.Dispatch<React.SetStateAction<boolean>>;
}

const BlurredMenu: React.FC<Blur> = ({ setUserOption }) => {
  const [current, send] = useActor(authService);

  return (
    <div className="blurred__options">
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
