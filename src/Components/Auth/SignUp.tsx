import { Form, Formik } from 'formik';
import { FC, useState } from 'react';
import TextField from '../FormFields/TextField';
import { AuthSchema } from '../../Validations/AuthSchemas';
import axios from 'axios';
import { useActor } from '@xstate/react';
import { authService } from './AuthStateMachine';
import { MessageI, UserAccountData } from '../../Interfaces/auth/authInterface';

const SignUp: FC = () => {
  const [, send] = useActor(authService);
  const [message, setMessage] = useState<MessageI>({
    message: '',
    status: 0,
  });

  const createAccount = (values: UserAccountData) => {
    console.log(values);
    axios
      .post(`${process.env.REACT_APP_API}/auth/create-account`, values)
      .then(res => {
        setMessage({ message: res.data.message, status: res.status });
        if (res.status === 200) {
          setTimeout(() => {
            send('SIGN_IN');
          }, 1000);
        }
      })
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
        {message.message && (
          <p
            className={`auth__message ${
              message.status === 200
                ? 'auth__message--accepted'
                : 'auth__message--refused'
            }`}
          >
            {message.message}
          </p>
        )}
        <p className="auth__form-link">
          Already a member ?{' '}
          <span className="auth__form-next" onClick={() => send('SIGN_IN')}>
            Sign in
          </span>
        </p>
      </main>
    </>
  );
};

export default SignUp;