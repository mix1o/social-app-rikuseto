import { Form, Formik } from 'formik';
import { FC } from 'react';
import TextField from '../../Formik/TextField';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useService } from '@xstate/react';
import { authService } from './AuthStateMachine';
import { AuthSchema2 as AuthSchema } from '../../Formik/ValidationSchemas';

interface UserLoginData {
  email: string;
  password: string;
}

const SignIn: FC = () => {
  const [, setCookie] = useCookies();
  const [, send] = useService(authService);

  const handleLogIn = (values: UserLoginData) => {
    axios
      .post(`${process.env.REACT_APP_API}/auth/login`, values)
      .then(res => {
        if (res.data.valid) {
          setCookie('user', res.data.user);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="wrapper">
      <main className="auth">
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
              placeholderLabel="monke@gmail.com"
              type="email"
            />
            <TextField
              key="password-input-field"
              name="password"
              placeholderLabel="Password"
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
    </div>
  );
};

export default SignIn;
