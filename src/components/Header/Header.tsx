import { FC, useState, useEffect, useReducer, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { motion as m } from 'framer-motion';
import { useActor } from '@xstate/react';
import { authService } from '../Auth/AuthStateMachine';
import logo from '../../assets/logo/logo.png';
import BlurredMenu from '../Navigation/BlurredMenu';
import { Link } from 'react-router-dom';
import { useTheme } from '../../helpers/useTheme';

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

  const [, send] = useActor(authService);

  const theme = localStorage.getItem('theme');

  const parsedTheme = theme ? JSON.parse(theme) : { theme: 'light' };

  const [idx, setIdx] = useState(parsedTheme.theme === 'dark' ? 0 : 1);

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
          onClick={() => setOpenMenu(true)}
        >
          <i className="fas fa-sliders-h" />
        </button>
      </div>

      <m.div
        initial="closed"
        animate={openMenu ? 'open' : 'closed'}
        variants={variants}
        className="header__menu"
      >
        <div className="header__container">
          <h4 className="header__heading-main">Menu</h4>
          <button onClick={() => setOpenMenu(false)} className="header__close">
            <i className="fas fa-times" />
          </button>
        </div>
        <div className="header__section">
          <p className="header__heading-section">Useful links</p>
          <p>About us</p>
          <p>Contact</p>
          <p>Support</p>
        </div>
        <div className="header__section">
          <p className="header__heading-section">Theme</p>
          <p className="header__information">
            Dark mode is:{' '}
            {idx === 0 ? (
              <span className="header__marked">on</span>
            ) : (
              <span className="header__marked">off</span>
            )}
          </p>
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
        </div>
        {!user && (
          <div className="header__section">
            <p className="header__heading-section">
              Log in to use all functionality
            </p>
            <div className="header__container-links">
              <Link className="header__link" to="/auth">
                Sign In
              </Link>
              <Link
                className="header__link header__link--empty"
                onClick={() => send('SIGN_UP')}
                to="/auth"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
        {user && (
          <div className="header__section">
            <p className="header__heading-section">
              Check your settings account
            </p>
            <div className="header__container-links">
              <Link className="header__link" to="/account">
                Account
              </Link>
              <button
                className="header__link header__link--empty"
                onClick={() => {
                  removeCookie('user');
                  setOpenMenu(false);
                }}
              >
                Log out
              </button>
            </div>
          </div>
        )}
      </m.div>

      {userOption && <BlurredMenu setUserOption={setUserOption} />}
    </div>
  );
};

export default Header;
