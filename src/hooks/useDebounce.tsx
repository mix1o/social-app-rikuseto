import { useEffect, useState } from 'react';

const useDebounce = (value: string, delay: number = 500) => {
  const [debouceValue, setDebouceValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouceValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouceValue;
};

export default useDebounce;
