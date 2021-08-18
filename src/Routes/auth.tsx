import Auth from '../components/Auth/Auth';
import Account from '../components/Account/Account';
import { useCookies } from 'react-cookie';

export const AuthRoute = {
  component: Auth,
  url: '/auth',
  exact: true,
};

export const AccountRoute = {
  component: Account,
  url: '/account',
  exact: true,
};
