import Profile from '../pages/Profile/Profile';

export const ProfileRoutes = {
  Component: Profile,
  url: '/profile/:id',
  exact: true,
  permission: false,
};
