import * as yup from 'yup';

export const newPasswordValidation = yup.object({
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
