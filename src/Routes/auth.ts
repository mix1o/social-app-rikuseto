import Auth from '../components/Auth/Auth';
import Account from '../components/Account/Account';

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
