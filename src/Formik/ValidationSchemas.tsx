import * as yup from 'yup';

export const AuthSchema = yup.object({
  email: yup.string().email('Email is not  valid').defined('Email is required'),
  firstName: yup
    .string()
    .min(2, 'Must be at least 2 characters long')
    .defined('First Name is  required'),
  lastName: yup
    .string()
    .min(2, 'Must be at least 2 characters long')
    .defined('Last Name is required'),
  password: yup
    .string()
    .min(8, 'Password to short! Must be at least 8 characters long')
    .matches(
      /^(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])/,
      'Password must contains at least one lower and uppercase letter and one number'
    )
    .defined('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords do not match')
    .defined('Confirm password is required'),
});

export const AuthSchema2 = yup.object({
  email: yup.string().email('Email is not  valid').defined('Email is required'),
  password: yup
    .string()
    .min(8, 'Password to short! Must be at least 8 characters long')
    .matches(
      /^(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])/,
      'Password must contains at least one lower and uppercase letter and one number'
    )
    .defined('Password is required'),
});

export const AuthSchema3 = yup.object({
  email: yup.string().email('Email is not valid').defined('Email is required'),
});
