import { FC, useEffect, useState } from 'react';

interface TestInterface {
  id: number;
  name: string;
}

const App: FC = () => {
  const [api, setApi] = useState<TestInterface[]>([]);

  useEffect(() => {
    fetch('https://rikuseto-social.herokuapp.com/test')
      .then(res => res.json())
      .then(json => setApi(json));
  }, []);

  return (
    <div>
      <h1>New social app is coming ! Change</h1>
      <div style={{ textAlign: 'center' }}>{JSON.stringify(api)}</div>
    </div>
  );
};

export default App;
