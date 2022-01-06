import App from '../App';
import ReactQueryProvider from './ReactQuery';
import StylesProvider from './StylesProvider';

const GlobalProviders = () => {
  return (
    <>
      <ReactQueryProvider>
        <StylesProvider>
          <App />
        </StylesProvider>
      </ReactQueryProvider>
    </>
  );
};

export default GlobalProviders;
