import { useActor } from '@xstate/react';
import { authService } from '../../Auth/AuthStateMachine';
import SignIn from '../../Auth/SignIn';
import SignUp from '../../Auth/SignUp';
import ResetPassword from '../../Auth/ResetPassword';
import { Dispatch, FC, SetStateAction } from 'react';
import { motion as m } from 'framer-motion';

const scaleV = {
  hidden: {
    scale: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    scale: 0,
  },
};

const BlurredContent: FC<{ closeHandler: () => void }> = ({
  children,
  closeHandler,
}) => {
  return (
    <BlurredBG handler={closeHandler}>
      <m.div
        className="blurred__content"
        variants={scaleV}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e: any) => e.stopPropagation()}
      >
        {children}
      </m.div>
    </BlurredBG>
  );
};

const BlurredBG: FC<{
  handler: () => void;
}> = ({ children, handler }) => {
  return (
    <m.div
      data-testid="blurred"
      className="blurred"
      onClick={handler}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </m.div>
  );
};

export const BlurredMenu: FC<{
  stateHandler: Dispatch<SetStateAction<boolean>>;
}> = ({ stateHandler }) => {
  const [current, send] = useActor(authService);
  return (
    <BlurredContent
      closeHandler={() => {
        stateHandler(false);
        send('SIGN_IN');
      }}
    >
      <div className="blurred__option">
        {current.matches('signIn') && <SignIn />}
        {current.matches('signUp') && <SignUp />}
        {current.matches('resetPassword') && <ResetPassword />}
      </div>
    </BlurredContent>
  );
};

export default BlurredContent;
