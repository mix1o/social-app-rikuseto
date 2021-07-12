import { FC } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Posts from './components/Posts/Posts';

const App: FC = () => {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={Posts} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
