import { CookieUser } from '../../../interfaces/auth/authInterface';

export const checkUser = (id: string | undefined) => {
  if (!id) {
    window.location.href = '/auth';
    return;
  }
};
