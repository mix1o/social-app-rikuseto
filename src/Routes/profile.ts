import Profile from '../Components/Profile/Profile';

export const ProfileRoutes = {
  Component: Profile,
  url: '/profile/:id',
  exact: true,
  permission: false,
};
