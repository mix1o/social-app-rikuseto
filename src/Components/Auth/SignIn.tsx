import { Form, Formik } from 'formik';
import { FC } from 'react';
import TextField from '../FormFields/TextField';
import { useActor } from '@xstate/react';
import { authService } from './AuthStateMachine';
import { loginSchema } from '../../validations/authSchemas';
import { BaseUserData } from '../../interfaces/auth/authInterface';
import { useAuth } from '../../hooks/useAuth';

const SignIn: FC = () => {
  const [, send] = useActor(authService);
  const { signIn, loading, message } = useAuth();

  const handleLogIn = async (values: BaseUserData) => await signIn(values);

  return (
    <>
      <main className="auth__main">
        <div className="auth__header">
          <h1>Login</h1>
          <p className="auth__sub-headline">Please sign in to continue.</p>
        </div>
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={values => handleLogIn(values)}
          validationSchema={loginSchema}
        >
          <Form className="auth-form">
            <TextField
              key="email-input-field"
              name="email"
              label="monke@gmail.com"
              type="email"
            />
            <TextField
              key="password-input-field"
              name="password"
              label="Password"
              type="password"
            />
            <div className="auth-form__btn-wrapper">
              <button
                type="button"
                className="auth-form__next-form"
                disabled={loading}
                onClick={() => {
                  send('RESET_PASSWORD');
                }}
              >
                Reset password
              </button>
              <button
                type="submit"
                className="auth-form__submit"
                disabled={loading}
              >
                Sign In
              </button>
            </div>
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
        <div>
          <p className="auth__form-link">
            Don't have account yet ?
            <span className="auth__form-next" onClick={() => send('SIGN_UP')}>
              {' '}
              Sign Up
            </span>
          </p>
        </div>
      </main>
    </>
  );
};

export default SignIn;
