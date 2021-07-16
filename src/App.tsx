import { FC, ReactChild } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Auth from './components/Auth/Auth';
import { Routes } from './Routes';
import { useCookies } from 'react-cookie';

const App: FC = () => {
  const [cookies, , removeCookie] = useCookies();
  const { user } = cookies;

  return (
    <div>
      {/* <p>{JSON.stringify(user, null, 2)}</p> */}
      {user && <button onClick={() => removeCookie('user')}>Log out</button>}
      <Router>
        <Switch>
          {Routes.map(
            ({ component: Component, url, exact }): ReactChild => (
              <Route key={url} path={url} exact={exact} component={Component} />
            )
          )}
        </Switch>
      </Router>
    </div>
  );
};

export default App;
