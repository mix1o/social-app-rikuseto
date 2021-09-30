import Account from '../Components/Account/Account';
import Auth from '../Pages/Auth';

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
