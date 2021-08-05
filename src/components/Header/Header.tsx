import { FC, useState, useEffect, useReducer, useRef } from 'react';
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

  const { user } = cookies;

  const [current, send] = useActor(authService);

  const theme = localStorage.getItem('theme');
  const [idx, setIdx] = useState(
    JSON.parse(theme || '').theme === 'dark' ? 0 : 1
  );

  const handleChangeTheme = (property: string) => {
    localStorage.setItem('theme', JSON.stringify({ theme: property }));
    html!.dataset!.value = property;
  };

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

      <m.div
        initial="closed"
        animate={openMenu ? 'open' : 'closed'}
        variants={variants}
        className="header__menu"
      >
        <div onClick={() => setOpenMenu(false)}>x</div>
        <p>Theme </p>
        <m.div
          className={`${
            idx === 1 ? 'container-theme-disabled' : 'container-theme--active'
          } container-theme`}
          onClick={() => {
            if (idx === 0) {
              handleChangeTheme('light');
              setIdx(1);
              return;
            }
            if (idx === 1) {
              handleChangeTheme('dark');
              setIdx(0);
              return;
            }
          }}
        >
          <m.div layout className="circle-theme"></m.div>
        </m.div>
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
