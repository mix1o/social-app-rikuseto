import * as yup from 'yup';

export const AuthSchema = yup.object({
  email: yup.string().email('Email is not  valid').defined('Email is required'),
  password: yup
    .string()
    .min(8, 'Password to short! Must be at least 8 characters long')
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/,
      'Password must contains at least one letter, one special character and one number'
    )
    .defined('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords do not match')
    .defined('Confirm password is required'),
  phone: yup.string(),
});
