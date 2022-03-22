import { Form, Formik } from 'formik';
import { FC } from 'react';
import TextField from '../FormFields/TextField';
import { registrationSchema } from '../../validations/authSchemas';
import { useActor } from '@xstate/react';
import { authService } from './AuthStateMachine';
import { useAuth } from '../../hooks/useAuth';
import ServerErrorMessage from '../Errors/ServerErrorMessage';

const SignUp: FC = () => {
  const [, send] = useActor(authService);
  const { loading, message, signUp } = useAuth();

  return (
    <>
      <main className="auth__main">
        <div className="auth__header">
          <h1 data-testid="heading">Sign up</h1>
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
          onSubmit={values => signUp(values)}
          validationSchema={registrationSchema}
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

            <button
              type="submit"
              className="btn auth-form__submit"
              disabled={loading}
              data-testid="btn-sign-up"
            >
              Sign Up
            </button>
          </Form>
        </Formik>
        <ServerErrorMessage
          message={message.message}
          className="auth__message"
          status={message.status}
        />
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
