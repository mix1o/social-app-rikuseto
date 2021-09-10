import { FC, ReactChild, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Routes } from './Routes';
import Menu from './components/Navigation/Menu';
import { useCookies } from 'react-cookie';

const App: FC = () => {
  const html = document.querySelector('html');

  const [cookies] = useCookies();
  const { user } = cookies;

  useEffect(() => {
    const theme = localStorage.getItem('theme');

    if (theme === null) {
      localStorage.setItem('theme', JSON.stringify({ theme: 'light' }));
      html!.dataset.value = 'light';
    } else {
      html!.dataset.value = JSON.parse(theme).theme;
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
