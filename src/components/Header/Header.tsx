import { FC, useState, useEffect, ReactChild, ReactElement } from 'react';
import { useCookies } from 'react-cookie';
import SignIn from '../Auth/SignIn';
import SignUp from '../Auth/SignUp';
import { motion as m, AnimatePresence as Presence } from 'framer-motion';

import { useRef } from 'react';
import { type } from 'os';

const variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'tween',
      ease: 'easeIn',
      duration: 0.2,
    },
  },
  closed: {
    opacity: 0,
    y: '-100%',
    transition: {
      type: 'tween',
      ease: 'easeOut',
      duration: 0.2,
    },
  },
};

const USER_OPTIONS = {
  NULL: '',
  SIGN_IN: 'sign-in',
  SIGN_UP: 'sign-up',
};

const Header: FC = () => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [userOption, setUserOption] = useState(USER_OPTIONS.NULL);
  const [cookies, , removeCookie] = useCookies();
  const { user } = cookies;

  const handleUserChoose = (option: string) => {
    setUserOption(option);
  };

  useEffect(() => {
    setUserOption(USER_OPTIONS.NULL);
    setOpenMenu(false);
  }, [user]);

  return (
    <div className="header">
      <div className="header__content">
        <h3 className="header__message">RS</h3>
        <button
          className="header__nav-button"
          onClick={() => setOpenMenu(!openMenu)}
        ></button>
      </div>

      <m.div
        initial="closed"
        animate={openMenu ? 'open' : 'closed'}
        variants={variants}
        className="header__menu"
      >
        <div onClick={() => setOpenMenu(false)}>x</div>
        {!user && (
          <div>
            <button
              onClick={() => {
                handleUserChoose(USER_OPTIONS.SIGN_IN);
                setOpenMenu(false);
              }}
            >
              Log In
            </button>
            <button
              onClick={() => {
                handleUserChoose(USER_OPTIONS.SIGN_UP);
                setOpenMenu(false);
              }}
            >
              Sign In
            </button>
          </div>
        )}
        {user && (
          <div>
            <button onClick={() => removeCookie('user')}>Log out</button>
            <button>Account</button>
          </div>
        )}
      </m.div>

      {userOption.length >= 1 && (
        <div className="header__options">
          <div
            className="header__blurred-bg"
            onClick={() => setUserOption(USER_OPTIONS.NULL)}
          ></div>
          <>
            {userOption === USER_OPTIONS.SIGN_IN && (
              <div className="header__option">
                <SignIn />
                <button onClick={() => setUserOption(USER_OPTIONS.NULL)}>
                  close
                </button>
              </div>
            )}
            {userOption === USER_OPTIONS.SIGN_UP && (
              <>
                <div className="header__option">
                  <SignUp />
                  <button onClick={() => setUserOption(USER_OPTIONS.NULL)}>
                    close
                  </button>
                </div>
              </>
            )}
          </>
        </div>
      )}
    </div>
  );
};

export default Header;
