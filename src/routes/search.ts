import SearchedData from '../components/Search/SearchData';

export const SearchedDataRoute = {
  Component: SearchedData,
  url: '/search/:value',
  exact: true,
  permission: true,
};
