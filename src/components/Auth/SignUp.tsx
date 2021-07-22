import { Form, Formik } from 'formik';
import { FC } from 'react';
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

  const createAccount = (values: UserAccountData) => {
    axios
      .post(`${process.env.REACT_APP_API}/auth/create-account`, values)
      .then(res => console.log(res))
      .catch(e => console.log(e));
  };

  return (
    <main className="auth">
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
            placeholderLabel="Email address"
            type="email"
            id="email"
          />
          <TextField
            key="first-name-input-field"
            name="firstName"
            placeholderLabel="First Name"
            type="text"
            id="firsName"
          />
          <TextField
            key="last-name-input-field"
            name="lastName"
            placeholderLabel="Last Name"
            type="text"
            id="lastName"
          />
          <TextField
            key="password-input-field"
            name="password"
            placeholderLabel="Password"
            type="password"
            id="password"
          />
          <TextField
            key="password_confirm-input-field"
            name="confirmPassword"
            placeholderLabel="Confirm Password"
            type="password"
            id="password2"
          />

          <button type="submit" className="btn auth-form__submit">
            Sign Up
          </button>
        </Form>
      </Formik>
      <p className="auth__form-link">
        Already a member ?
        <span className="auth__form-next" onClick={() => send('SIGN_IN')}>
          {' '}
          Login now
        </span>
      </p>
    </main>
  );
};

export default SignUp;
