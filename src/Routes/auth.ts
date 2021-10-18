import Account from '../pages/Account/Account';
import Auth from '../pages/Auth/Auth';

export const AuthRoute = {
  component: Auth,
  url: '/auth',
  exact: true,
  permission: false,
};

export const AccountRoute = {
  component: Account,
  url: '/account',
  exact: true,
  permission: true,
};
