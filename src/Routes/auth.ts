import Account from '../pages/Account/Account';
import Auth from '../pages/Auth/Auth';

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
