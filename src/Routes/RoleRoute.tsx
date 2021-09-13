import { FC } from 'react';
import { useCookies } from 'react-cookie';
import { Route, Redirect } from 'react-router-dom';
import { CookieUser } from '../interfaces/auth/authInterface';

const RoleRoute: FC<{
  component: FC<any>;
  url: string;
  exact: boolean;
  permission: boolean;
}> = ({ component: Component, permission, exact, url }) => {
  const [cookies] = useCookies();
  const {
    user,
  }: {
    [name: string]: CookieUser;
  } = cookies;

  console.log(!permission ? 'uno case' : user ? 'duo case' : 'trio');

  return (
    <>
      <Route
        path={url}
        exact={exact}
        render={({ location }) => {
          return permission === false ? (
            <Component />
          ) : user ? (
            <Component />
          ) : (
            <Redirect to={{ pathname: '/auth' }} />
          );
        }}
      />
    </>
  );
};

export default RoleRoute;
