import { CookieUser } from '../Interfaces/auth/authInterface';

export const LikedElements = (
  user: CookieUser,
  likes: string[]
): boolean | undefined => {
  if (user) {
    const idx = likes.findIndex((element: string) => element === user._id);

    if (idx !== -1) {
      return true;
    } else {
      return false;
    }
  }
};
