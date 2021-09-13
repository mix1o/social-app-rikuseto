import { FC, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { CookieUser } from '../../interfaces/auth/authInterface';
import Header from '../Header/Header';
import { checkUser } from './IsLogged/isLoggedUser';

const Account: FC = () => {
  const [cookies, , removeCookie] = useCookies();

  const {
    user,
  }: {
    [name: string]: CookieUser;
  } = cookies;

  // const [user]: CookieUser[] = useMemo(
  //   (): CookieUser[] => [{ ...cookies['user'] }],
  //   [cookies]
  // );

  useEffect(() => {
    checkUser(user._id);
  }, [user]);

  return (
    <>
      <Header />
      {user._id && (
        <div className="account">
          <div className="account__container-avatar">
            <img
              className="account__image"
              src={user.avatar}
              alt="User profile"
            />
          </div>
          <div className="account__user-information">
            <h3 className="account__name">
              {user.firstName} {user.lastName}
            </h3>
          </div>
          <div className="account__actions">
            <div className="account__section">
              <i className="fas fa-user"></i>
              <div>
                <p className="account__heading">Login details</p>
                <p className="account__description">Check or edit your data</p>
              </div>
              <i className="fas fa-chevron-right"></i>
            </div>
            <Link to="/saved-posts" className="account__section">
              <i className="fas fa-flag"></i>
              <div>
                <p className="account__heading">Saved posts</p>
                <p className="account__description">See your saved posts</p>
              </div>
              <i className="fas fa-chevron-right"></i>
            </Link>
            <Link to="/your-posts" className="account__section">
              <i className="fas fa-pen"></i>
              <div>
                <p className="account__heading">Your posts</p>
                <p className="account__description">Browse all your posts</p>
              </div>
              <i className="fas fa-chevron-right"></i>
            </Link>
            <Link to="/categories" className="account__section">
              <i className="fas fa-book"></i>
              <div>
                <p className="account__heading">Categories</p>
                <p className="account__description">
                  Personalize your favorite categories
                </p>
              </div>
              <i className="fas fa-chevron-right"></i>
            </Link>
            <div className="account__section">
              <i className="fas fa-headphones"></i>
              <div>
                <p className="account__heading">Help</p>
                <p className="account__description">Get help any time</p>
              </div>
              <i className="fas fa-chevron-right"></i>
            </div>
            <div className="account__section">
              <i className="fas fa-sign-out-alt"></i>
              <div>
                <p className="account__heading">
                  <button
                    onClick={() => {
                      removeCookie('user');
                      window.location.href = '/';
                    }}
                    className="account__logout"
                  >
                    Log out
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Account;
