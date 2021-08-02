import { FC, useState, useEffect, useReducer, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { motion as m } from 'framer-motion';
import { useActor } from '@xstate/react';
import { authService } from '../Auth/AuthStateMachine';
import logo from '../../assets/logo/logo.png';
import BlurredMenu from '../Navigation/BlurredMenu';

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

const Header: FC = () => {
  const html = document.querySelector('html');

  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [userOption, setUserOption] = useState<boolean>(false);
  const [cookies, , removeCookie] = useCookies();
  const [userTheme, setUserTheme] = useState('');
  const [toggleTheme, setToggleTheme] = useState<boolean>();
  const { user } = cookies;

  const [current, send] = useActor(authService);

  // const reducer = useCallback((theme, action) => {##FIX
  //   console.log(action);
  //   switch (action.type) {
  //     case 'CHANGE':
  //       localStorage.setItem('theme', action.payload.theme);
  //       return;
  //   }
  // }, []);

  // const [theme, dispatch] = useReducer(reducer, 'light', () => {
  //   const themeLocal = localStorage.getItem('theme');
  //   console.log(themeLocal);
  // });

  // useEffect(() => {
  //   localStorage.setItem('theme', JSON.stringify(theme));
  // }, [theme]);

  return (
    <div className="header">
      <div className="header__content">
        <h3 className="header__message">
          <img src={logo} alt="Logo" />
        </h3>
        <button
          className="header__nav-button"
          onClick={() => setOpenMenu(!openMenu)}
        >
          <i className="fas fa-bell" />
        </button>
      </div>
      {/* <button
        onClick={() => {
          userTheme === 'light' ? setUserTheme('dark') : setUserTheme('light');
        }}
      >
        Light
      </button> */}
      <button
        onClick={() => {
          // dispatch({ type: 'CHANGE', payload: { theme: 'light' } });
        }}
      >
        Light
      </button>
      <button
        onClick={() => {
          // dispatch({ type: 'CHANGE', payload: { theme: 'dark' } });
        }}
      >
        Dark
      </button>
      <m.div
        initial="closed"
        animate={openMenu ? 'open' : 'closed'}
        variants={variants}
        className="header__menu"
      >
        <div onClick={() => setOpenMenu(false)}>x</div>
        {user && (
          <div>
            <button onClick={() => removeCookie('user')}>Log out</button>
            <button>Account</button>
          </div>
        )}
      </m.div>

      {userOption && <BlurredMenu setUserOption={setUserOption} />}
    </div>
  );
};

export default Header;
