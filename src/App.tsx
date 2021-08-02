import React, { FC, ReactChild } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Routes } from './Routes';
import Header from './components/Header/Header';
import Menu from './components/Navigation/Menu';

const App: FC = () => {
  return (
    <div>
      <Header />
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
