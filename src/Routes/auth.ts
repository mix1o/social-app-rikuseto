import Account from '../pages/Account/Account';
import Auth from '../pages/Auth/Auth';
import NewPassword from '../components/Auth/NewPassword';

export const AuthRoute = {
  Component: Auth,
  url: '/auth',
  exact: true,
  permission: false,
};

export const AccountRoute = {
  Component: Account,
  url: '/account',
  exact: true,
  permission: true,
};

export const NewPasswordRoute = {
  Component: NewPassword,
  url: '/reset-password/:token',
  exact: true,
  permission: false,
};
