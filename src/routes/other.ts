import About from '../pages/About/About';
import NotFound from '../pages/NotFound/NotFound';

export const AboutRoute = {
  Component: About,
  url: '/about',
  exact: true,
  permission: false,
};

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
