import axios from 'axios';
import { useQuery } from 'react-query';

export const useCategory = (userId: string) =>
  useQuery(
    ['favorites-category'],
    () =>
      axios
        .get(
          `${process.env.REACT_APP_API}/category/get-categories?userId=${userId}`
        )
        .then(res => res.data),
    {
      staleTime: 1000000,
    }
  );

export const useCategoryAll = (searchQuery: string) =>
  useQuery(
    ['all-category', searchQuery],

    () =>
      axios.get(`${process.env.REACT_APP_API}/category/filter`, {
        params: { value: searchQuery },
      })
  );
