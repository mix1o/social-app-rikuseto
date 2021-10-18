import Profile from '../pages/Profile/Profile';

export const ProfileRoutes = {
  component: Profile,
  url: '/profile/:id',
  exact: true,
  permission: false,
};
