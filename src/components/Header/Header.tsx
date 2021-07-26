import { FC, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import SignIn from '../Auth/SignIn';
import SignUp from '../Auth/SignUp';
import { motion as m, AnimatePresence as Presence } from 'framer-motion';
import { set } from 'lodash';

const variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: '100%' },
};

const HeaderItem = () => {
  return <div>a</div>;
};

const Header: FC = () => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [cookies, , removeCookie] = useCookies();
  const { user } = cookies;
  const [userOption, setUserOption] = useState<number>(0);

  const handleUserChoose = (option: number) => {
    setUserOption(option);
  };

  useEffect(() => {
    setUserOption(0);
    setOpenMenu(false);
  }, [user]);
  console.log(openMenu);
  return (
    <div className="header">
      <h3 className="header__message">RS</h3>
      <button
        className="header__nav-button"
        onClick={() => setOpenMenu(!openMenu)}
      ></button>
      <Presence>
        {openMenu && (
          <m.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'tween' }}
            exit={{ x: 1000 }}
            className="header__menu"
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
                    setOpenMenu(false);
                    handleUserChoose(2);
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
        )}
      </Presence>
      <div style={{ position: 'absolute', top: 0, left: 0 }}>
        {userOption === 1 && (
          <>
            <SignIn /> <button onClick={() => setUserOption(0)}>close</button>
          </>
        )}
        {userOption === 2 && <SignUp />}
      </div>
    </div>
  );
};

export default Header;
