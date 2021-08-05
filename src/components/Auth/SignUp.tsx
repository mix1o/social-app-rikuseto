import { Form, Formik } from 'formik';
import { FC, useState } from 'react';
import TextField from '../../Formik/TextField';
import { AuthSchema } from '../../Formik/ValidationSchemas';
import axios from 'axios';
import { useService } from '@xstate/react';
import { authService } from './AuthStateMachine';

interface UserAccountData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

const SignUp: FC = () => {
  const [, send] = useService(authService);
  const [message, setMessage] = useState('');

  const createAccount = (values: UserAccountData) => {
    axios
      .post(`${process.env.REACT_APP_API}/auth/create-account`, values)
      .then(res => setMessage(res.data.message))
      .catch(e => console.log(e));
  };

  return (
    <>
      <main className="auth__main">
        <div className="auth__header">
          <h1>Sign up</h1>
          <p className="auth__sub-headline">Please sign in to continue.</p>
        </div>
        <Formik
          initialValues={{
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: '',
          }}
          onSubmit={values => createAccount(values)}
          validationSchema={AuthSchema}
        >
          <Form className="auth-form">
            <TextField
              key="email-input-field"
              name="email"
              label="Email address"
              type="email"
              id="email"
            />
            <TextField
              key="first-name-input-field"
              name="firstName"
              label="First Name"
              type="text"
              id="firsName"
            />
            <TextField
              key="last-name-input-field"
              name="lastName"
              label="Last Name"
              type="text"
              id="lastName"
            />
            <TextField
              key="password-input-field"
              name="password"
              label="Password"
              type="password"
              id="password"
            />
            <TextField
              key="password_confirm-input-field"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="password2"
            />

            <button type="submit" className="btn auth-form__submit">
              Sign Up
            </button>
          </Form>
        </Formik>
        {message && <p className="auth__message">{message}</p>}
        <p className="auth__form-link">
          Already a member ?
          <span className="auth__form-next" onClick={() => send('SIGN_IN')}>
            {' '}
            Login now
          </span>
        </p>
      </main>
    </>
  );
};

export default SignUp;
