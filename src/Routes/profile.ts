import Profile from '../Components/Profile/Profile';

export const ProfileRoutes = {
  component: Profile,
  url: '/profile/:id',
  exact: true,
  permission: false,
};
