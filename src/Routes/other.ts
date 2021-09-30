import NotFound from '../Components/NotFound/NotFound';

export const NotFoundRoute = {
  component: NotFound,
  url: '/not-found',
  exact: true,
  permission: false,
};

export const NotFoundAllRoute = {
  component: NotFound,
  permission: false,
};
