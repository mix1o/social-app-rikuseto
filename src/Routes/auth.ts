import Account from '../Components/Account/Account';
import Auth from '../Pages/Auth';

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
