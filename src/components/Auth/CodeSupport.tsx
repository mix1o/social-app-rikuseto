import { CodesStatuses } from '../../enums/CodesStatus';

export const checkStatusCode = (status: CodesStatuses) => {
  switch (status) {
    case 200:
      return 'auth__message--accepted';
    case 201:
      return 'auth__message--accepted';
    case 205:
      return 'auth__message--accepted';
    case 240:
      return 'auth__message--refused';
    case 401:
      return 'auth__message--refused';
    case 400:
      return 'auth__message--refused';
    default:
      return 'auth__message';
  }
};
