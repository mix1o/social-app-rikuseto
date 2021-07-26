import { FC, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import SignIn from '../Auth/SignIn';
import SignUp from '../Auth/SignUp';
import { motion as m, AnimatePresence as Presence } from 'framer-motion';

import { useRef } from 'react';

const variants = {
  open: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'tween',
      ease: 'easeIn',
    },
  },
  closed: {
    opacity: 0,
    x: '100%',
    transition: {
      type: 'tween',
      ease: 'easeOut',
    },
  },
};

const HeaderItem = () => {
  return <div>a</div>;
};

const Header: FC = () => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [cookies, , removeCookie] = useCookies();
  const { user } = cookies;
  const [userOption, setUserOption] = useState<number>(0);
  const menuRef = useRef<HTMLButtonElement>(null);
  const handleUserChoose = (option: number) => {
    setUserOption(option);
  };

  useEffect(() => {
    setUserOption(0);
    setOpenMenu(false);
  }, [user]);

  return (
    <div className="header">
      <h3 className="header__message">RS</h3>
      <button
        className="header__nav-button"
        onClick={() => setOpenMenu(!openMenu)}
        // ref={menuRef}
      ></button>
      <m.div
        initial="closed"
        animate={openMenu ? 'open' : 'closed'}
        variants={variants}
        className="header__menu"
        // drag
        // dragConstraints={menuRef}
        // onDrag={e => console.log(e)}
      >
        <div onClick={() => setOpenMenu(false)}>x</div>
        {!user && (
          <div>
            <button
              onClick={() => {
                handleUserChoose(1);
                setOpenMenu(false);
              }}
            >
              Log In
            </button>
            <button
              onClick={() => {
                handleUserChoose(2);
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
      <div style={{ position: 'absolute', top: 0, left: 0 }}>
        {userOption === 1 && (
          <>
            <SignIn /> <button onClick={() => setUserOption(0)}>close</button>
          </>
        )}
        {userOption === 2 && (
          <>
            {' '}
            <SignUp /> <button onClick={() => setUserOption(0)}>close</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
