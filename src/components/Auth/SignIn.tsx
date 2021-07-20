import { Form, Formik } from 'formik';
import { FC } from 'react';
import TextField from '../../Formik/TextField';
import { AuthSchema } from '../../Formik/ValidationSchemas';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useMachine, useService } from '@xstate/react';
import { AuthStateMachine, authService } from './AuthStateMachine';

interface UserLoginData {
  email: string;
  password: string;
}

const SignIn: FC = () => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [, send] = useService(authService);

  console.log(cookies);

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
    <>
      <header>
        <h1>Login</h1>
        <p>Please sign in to continue.</p>
      </header>
      <main>
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={values => handleLogIn(values)}
        >
          <Form>
            <TextField
              key="email-input-field"
              name="email"
              placeholder="monke@gmail.com"
              type="email"
            />
            <TextField
              key="password-input-field"
              name="password"
              placeholder="***********"
              type="password"
            />
            <button type="submit">Sign In</button>
          </Form>
        </Formik>
        <button onClick={() => send('SIGN_UP')}>
          Don't have acc ? Sign Up
        </button>
        <button
          onClick={() => {
            send('RESET_PASSWORD');
          }}
        >
          Reset password
        </button>
      </main>
    </>
  );
};

export default SignIn;
