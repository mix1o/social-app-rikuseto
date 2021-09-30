import Auth from '../Components/Auth/Auth';
import Account from '../Components/Account/Account';

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
