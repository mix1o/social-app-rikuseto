import SearchedData from '../Components/Searching/SearchedData';

export const SearchedDataRoute = {
  Component: SearchedData,
  url: '/search/:value',
  exact: true,
  permission: true,
};
