export const checkUser = (user: any) => {
  if (!user) {
    window.location.href = '/auth';
    return;
  }
};
