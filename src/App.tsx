import { FC, ReactChild, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Routes } from './Routes';
import Menu from './components/Navigation/Menu';
import { useCookies } from 'react-cookie';
import { useCounter } from './store/sub';

const App: FC = () => {
  const html = document.querySelector('html');

  const [cookies] = useCookies();
  const { user } = cookies;
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
  }, [html]);

  return (
    <div>
      <Router>
        <Switch>
          {Routes.map(
            ({ component: Component, url, exact }): ReactChild => (
              <Route key={url} path={url} exact={exact} component={Component} />
            )
          )}
        </Switch>
        {user && <Menu />}
      </Router>
    </div>
  );
};

export default App;
