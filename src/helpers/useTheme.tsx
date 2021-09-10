import { useEffect, useState } from 'react';

export const useTheme = () => {
  const theme = localStorage.getItem('theme');
  const [currentTheme, setCurrentTheme] = useState('');

  useEffect(() => {
    setCurrentTheme(theme ? JSON.parse(theme).theme : { theme: 'light' });
  }, [theme]);
  return { currentTheme };
};
// f8f8f8; light font for dark theme
// 36344b fpr light theme
