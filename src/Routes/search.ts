import SearchedData from '../components/Search/SearchData';

export const SearchedDataRoute = {
  component: SearchedData,
  url: '/search/:value',
  exact: true,
  permission: true,
};
