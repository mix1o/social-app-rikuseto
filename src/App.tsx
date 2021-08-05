import { FC, ReactChild, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Routes } from './Routes';
import Header from './components/Header/Header';
import Menu from './components/Navigation/Menu';

const App: FC = () => {
  const html = document.querySelector('html');

  useEffect(() => {
    const theme = localStorage.getItem('theme');

    if (theme === null) {
      localStorage.setItem('theme', JSON.stringify({ theme: 'light' }));
      html!.dataset.value = 'light';
    } else {
      html!.dataset.value = JSON.parse(theme).theme;
    }
  }, []);

  console.log('dd');
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

        <Menu />
      </Router>
    </div>
  );
};

export default App;
