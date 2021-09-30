import { FC, useState, ChangeEvent, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { motion as m } from 'framer-motion';
import { useActor } from '@xstate/react';
import { authService } from '../Auth/AuthStateMachine';
import logo from '../../Assets/logo/logo.png';
import { Link } from 'react-router-dom';
import { useCounter } from '../../store/sub';
import { CookieUser } from '../../Interfaces/auth/authInterface';
import { useHistory } from 'react-router-dom';
import Toggle from '../Animations/Toggle';
import { AnimatePresence as Presence } from 'framer-motion';
import { CategoryArray } from '../../Interfaces/posts/category';
import { PostInterface } from '../../Interfaces/posts/postInterfaces';
import { SearchedCategory, SearchedUser } from '../Utils/SearchElements';
import { handleFetch } from '../../Helpers/handleSearch';

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

interface responseInterface {
  categories: Omit<CategoryArray, 'user_id'>[];
  posts: PostInterface[];
  users: CookieUser[];
}

const Header: FC = () => {
  const html = document.querySelector('html');

  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [, actions] = useCounter();
  const history = useHistory();
  const [hideElem, setHideElem] = useState(false);
  const [value, setValue] = useState('');
  const [cookies, , removeCookie] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;

  const [, send] = useActor(authService);

  const theme = localStorage.getItem('theme');

  const parsedTheme = theme ? JSON.parse(theme) : { theme: 'light' };

  const [idx, setIdx] = useState(parsedTheme.theme === 'dark' ? 0 : 1);

  const handleChangeTheme = (property: string) => {
    localStorage.setItem('theme', JSON.stringify({ theme: property }));
    actions.theme(property);
    html!.dataset!.value = property;
  };

  const resetSearch = () => {
    setHideElem(false);
    setLoading(true);
    setResponseData({
      categories: [],
      posts: [],
      users: [],
    });
  };

  const [responseData, setResponseData] = useState<
    | responseInterface
    | {
        categories: [];
        posts: [];
        users: [];
      }
  >();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (value.length > 0) {
        const data = await handleFetch(value, '3');
        if (data) setLoading(false);
        setResponseData(data);
      }
    }, 1000);

    if (value.length > 0 && openMenu) {
      setHideElem(true);
    }

    if (value.length === 0) {
      resetSearch();
    }

    if (openMenu === false) {
      setValue('');
      resetSearch();
    }

    return () => clearTimeout(delay);
  }, [value, openMenu]);

  return (
    <header className="header">
      <div className="header__content">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h3 className="header__message">
            <Link to="/">
              <img src={logo} alt="Logo" />
            </Link>
          </h3>
        </div>
        <button
          className="header__nav-button"
          onClick={() => setOpenMenu(true)}
        >
          <i className="fas fa-sliders-h" />
        </button>
      </div>
      <Presence exitBeforeEnter>
        {openMenu && (
          <m.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={variants}
            className="header__menu"
          >
            <div className="header__container">
              <h4 className="header__heading-main">Menu</h4>
              <button
                onClick={() => setOpenMenu(false)}
                className="header__close"
              >
                <i className="fas fa-times" />
              </button>
            </div>
            <label className="header__label">
              <input
                className="header__input  auth-form__input"
                type="text"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setValue(e.target.value)
                }
              />
              <button className="header__btn-search">
                <i className="fas fa-search" />
              </button>
            </label>
            {hideElem && !loading && (
              <section className="header__searched-content">
                {responseData!.users?.length > 0 && (
                  <p className="header__heading-section">Users</p>
                )}
                <article className="header__heading-article">
                  {responseData?.users.map(
                    ({ firstName, lastName, avatar, _id }) => (
                      <SearchedUser
                        key={_id}
                        avatar={avatar}
                        firstName={firstName}
                        lastName={lastName}
                        _id={_id}
                      />
                    )
                  )}
                  {responseData!.categories?.length > 0 && (
                    <p className="header__search-title  header__heading-section">
                      Categories
                    </p>
                  )}
                </article>
                <article>
                  {responseData?.categories.map(({ name, totalPosts, _id }) => (
                    <SearchedCategory
                      key={_id}
                      name={name}
                      totalPosts={totalPosts}
                      _id={_id}
                    />
                  ))}
                </article>
                {(responseData!.categories?.length > 0 ||
                  responseData!.users.length > 0) && (
                  <Link className="header__see-more" to={`/search/${value}`}>
                    See more
                  </Link>
                )}
              </section>
            )}
            {hideElem && loading && (
              <p className="header__loading">Loading...</p>
            )}

            {!hideElem && (
              <>
                <section className="header__section">
                  <h5 className="header__heading-section">Useful links</h5>
                  <p>About us</p>
                  <p>Contact</p>
                  <p>Support</p>
                </section>
                <section className="header__section">
                  <p className="header__heading-section">Theme</p>
                  <p className="header__information">
                    Dark mode is:{' '}
                    {idx === 0 ? (
                      <span className="header__marked">on</span>
                    ) : (
                      <span className="header__marked">off</span>
                    )}
                  </p>
                  <Toggle
                    className={`${
                      idx === 1
                        ? 'container-theme-disabled'
                        : 'container-theme--active'
                    }`}
                    toggleHandler={() => {
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
                  />
                </section>
              </>
            )}
            {!user && !hideElem && (
              <section className="header__section">
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
              </section>
            )}
            {user && !hideElem && (
              <section className="header__section">
                <p className="header__heading-section">
                  Check your settings account
                </p>
                <div className="header__container-links">
                  <Link className="header__link" to="/account">
                    Account
                  </Link>
                  <button
                    className="header__link header__link--empty"
                    onClick={e => {
                      e.stopPropagation();
                      removeCookie('user');
                      setOpenMenu(false);
                      history.push('/');
                    }}
                  >
                    Log out
                  </button>
                </div>
              </section>
            )}
          </m.div>
        )}
      </Presence>
    </header>
  );
};

export default Header;
