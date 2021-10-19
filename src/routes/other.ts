import NotFound from '../pages/NotFound/NotFound';

export const NotFoundRoute = {
  Component: NotFound,
  url: '/not-found',
  exact: true,
  permission: false,
};

export const NotFoundAllRoute = {
  Component: NotFound,
  permission: false,
};
