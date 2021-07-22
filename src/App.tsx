import { FC, ReactChild } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Routes } from './Routes';
import { useCookies } from 'react-cookie';
import Header from './components/Header/Header';

const App: FC = () => {
  const [cookies] = useCookies();

  return (
    <div>
      {/* <Header /> */}
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
