import { FC, ReactChild, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { Routes } from './Routes';
import Menu from './components/Navigation/Menu';
import { useCookies } from 'react-cookie';
import { useCounter } from './store/sub';
import { CookieUser } from './interfaces/auth/authInterface';

const App: FC = () => {
  const html = document.querySelector('html');

  const [cookies] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;

  const [, actions] = useCounter();

  useEffect(() => {
    const theme = localStorage.getItem('theme');

    if (theme === null) {
      localStorage.setItem('theme', JSON.stringify({ theme: 'light' }));
      html!.dataset.value = 'light';
      actions.theme('light');
    } else {
      html!.dataset.value = JSON.parse(theme).theme;
      actions.theme('dark');
    }
  }, [html, actions]);

  return (
    <div>
      <Router>
        <Switch>
          {Routes.map(({ component, url, exact, permission }): ReactChild => {
            return permission === false ? (
              <Route path={url} exact={exact} component={component} key={url} />
            ) : user ? (
              <Route path={url} exact={exact} component={component} key={url} />
            ) : (
              <Redirect to={{ pathname: '/auth' }} key={url} />
            );
          })}
        </Switch>
        {user && <Menu />}
      </Router>
    </div>
  );
};

export default App;
