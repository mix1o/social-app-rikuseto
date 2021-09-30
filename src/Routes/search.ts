import SearchedData from '../Components/Searching/SearchedData';

export const SearchedDataRoute = {
  component: SearchedData,
  url: '/search/:value',
  exact: true,
  permission: true,
};
