import App from '../App';
import ReactQueryProvider from './ReactQuery';

const GlobalProviders = () => {
  return (
    <>
      <ReactQueryProvider>
        <App />
      </ReactQueryProvider>
    </>
  );
};

export default GlobalProviders;
