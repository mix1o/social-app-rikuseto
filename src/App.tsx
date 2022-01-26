import { FC, ReactChild, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Routes } from './routes';
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
    } else {
      html!.dataset.value = JSON.parse(theme).theme;
    }
    const parsed = JSON.parse(theme || 'light');
    actions.theme(parsed.theme);
  }, [html, actions]);

  return (
    <div>
      <Router>
        <Switch>
          {Routes.map(
            ({ Component, url, exact, permission }, idx): ReactChild =>
              permission === true ? (
                <Route
                  exact={exact}
                  key={idx}
                  path={user ? url : '/auth'}
                  component={Component}
                />
              ) : (
                <Route
                  component={Component}
                  exact={exact}
                  path={url}
                  key={idx}
                />
              )
          )}
        </Switch>
        {user && <Menu />}
      </Router>
    </div>
  );
};

export default App;
