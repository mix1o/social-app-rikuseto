import * as yup from 'yup';

export enum ToUpdate {
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  EMAIL = 'email',
  PASSWORD = 'password',
}

export const DetailsValidation = (type: ToUpdate, value: string) => {
  switch (type) {
    case ToUpdate.FIRST_NAME:
      return yup
        .object({
          firstName: yup
            .string()
            .min(2, 'Must be at least 2 characters long')
            .defined('First Name is  required'),
        })
        .validate({
          firstName: value,
        });

    case ToUpdate.LAST_NAME:
      return yup
        .object({
          lastName: yup
            .string()
            .min(2, 'Must be at least 2 characters long')
            .defined('First Name is  required'),
        })
        .validate({
          lastName: value,
        });

    case ToUpdate.PASSWORD:
      return yup
        .object({
          password: yup
            .string()
            .min(8, 'Password to short! Must be at least 8 characters long')
            .matches(
              /^(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])/,
              'Password must contains at least one lower and uppercase letter and one number'
            )
            .defined('Password is required'),
        })
        .validate({
          password: value,
        });

    case ToUpdate.EMAIL:
      return yup
        .object({
          email: yup
            .string()
            .email('Email is not  valid')
            .defined('Email is required'),
        })
        .validate({
          email: value,
        });

    default:
      return null;
  }
};

export const deleteAccountSchema = (email: string) => {
  const emailRegexp = new RegExp(email);

  return yup.object({
    email: yup
      .string()
      .email('Email is not  valid')
      .matches(emailRegexp, 'Email must match account email')
      .defined('Email is required'),
    password: yup
      .string()
      .min(8, 'Password to short! Must be at least 8 characters long')
      .matches(
        /^(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])/,
        'Password must contains at least one lower and uppercase letter and one number'
      )
      .defined('Password is required'),
    verifyText: yup
      .string()
      .matches(
        /(delete my account)/i,
        'Field must match the following: delete my account'
      )
      .defined('Type: delete my account'),
  });
};
