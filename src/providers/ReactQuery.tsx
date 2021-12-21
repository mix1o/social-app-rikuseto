import { FC } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const queryClient = new QueryClient();

const ReactQueryProvider: FC = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.REACT_APP_PRODUCTION && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
