import { FC, ReactChild, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { Routes } from './routes';
import Menu from './components/Navigation/Menu';
import { useCookies } from 'react-cookie';
import { useCounter } from './store/sub';
import { CookieUser } from './interfaces/auth/authInterface';
import { createNotificationSubscription } from './hooks/Notifications/push-notification';

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
    } else {
      html!.dataset.value = JSON.parse(theme).theme;
    }
    const parsed = JSON.parse(theme || 'light');
    actions.theme(parsed.theme);
  }, [html, actions]);

  useEffect(() => {
    createNotificationSubscription().then(sub => {
      console.log(sub?.endpoint);
    });
  }, []);
  return (
    <div>
      <Router>
        <Switch>
          {Routes.map(
            ({ component, url, exact, permission }, idx): ReactChild => {
              return permission === false ? (
                <Route
                  path={url}
                  exact={exact}
                  component={component}
                  key={idx}
                />
              ) : user ? (
                <Route
                  path={url}
                  exact={exact}
                  component={component}
                  key={idx}
                />
              ) : (
                <Redirect to={{ pathname: '/auth' }} key={idx} />
              );
            }
          )}
        </Switch>
        {user && <Menu />}
      </Router>
    </div>
  );
};

export default App;
