import { FC } from 'react';
import GlobalStyles from '../styles/global';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../styles/themes';

const StylesProvider: FC = ({ children }) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
};

export default StylesProvider;
