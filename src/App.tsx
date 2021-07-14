import { FC, ReactChild } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Auth from './components/Auth/Auth';
import { useFetch } from './hooks/useFetch';
import { Routes } from './Routes';

const App: FC = () => {
  // const { data } = useFetch('https://jsonplaceholder.typicode.com/posts');

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
      </Router>
    </div>
  );
};

export default App;
