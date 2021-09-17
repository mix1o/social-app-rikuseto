import { Form, Formik } from 'formik';
import { FC } from 'react';
import TextField from '../../Formik/TextField';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useActor } from '@xstate/react';
import { authService } from './AuthStateMachine';
import { AuthSchema2 as AuthSchema } from '../../Formik/ValidationSchemas';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { MessageI } from '../../interfaces/auth/authInterface';

interface UserLoginData {
  email: string;
  password: string;
}

const SignIn: FC = () => {
  const [, setCookie] = useCookies();
  const [, send] = useActor(authService);
  const history = useHistory();
  const [message, setMessage] = useState<MessageI>({
    message: '',
    status: 0,
  });

  const handleLogIn = (values: UserLoginData) => {
    axios
      .post(`${process.env.REACT_APP_API}/auth/login`, values)
      .then(res => {
        if (res.status === 203) {
          setMessage({ message: res.data.message, status: res.status });
        }
        if (res.data.valid) {
          setMessage({ message: res.data.message, status: res.status });
          setCookie('user', res.data.user, { path: '/' });
          history.push('/');
          // window.location.reload();
        }
      })
      .catch(err => console.log(err));
  };

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
          validationSchema={AuthSchema}
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
                onClick={() => {
                  send('RESET_PASSWORD');
                }}
              >
                Reset password
              </button>
              <button type="submit" className="auth-form__submit">
                Sign In
              </button>
            </div>
          </Form>
        </Formik>
        {message.message && (
          <p
            className={`auth__message ${
              message.status === 203 ? 'auth__message--refused' : null
            } `}
          >
            {message.message}
          </p>
        )}
        <div>
          <p className="auth__form-link">
            Don't have account yet ?{' '}
            <span className="auth__form-next" onClick={() => send('SIGN_UP')}>
              Sign Up
            </span>
          </p>
        </div>
      </main>
    </>
  );
};

export default SignIn;
