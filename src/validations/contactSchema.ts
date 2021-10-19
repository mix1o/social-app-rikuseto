import * as yup from 'yup';

export const contactSchema = yup.object({
  email: yup.string().email('Email is not  valid').defined('Email is required'),
  name: yup
    .string()
    .min(2, 'Must be at least 2 characters long')
    .defined('Name is required'),
  message: yup
    .string()
    .min(10, 'Message must be at least 10 characters')
    .defined('Message is required'),
});
