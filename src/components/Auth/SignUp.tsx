import { Form, Formik } from 'formik';
import { FC } from 'react';
import TextField from '../../Formik/TextField';
import { AuthSchema } from '../../Formik/ValidationSchemas';
import axios from 'axios';
import { useMachine } from '@xstate/react';
import { AuthStateMachine } from './AuthStateMachine';

interface UserAccountData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

const SignUp: FC = () => {
  const [current, send] = useMachine(AuthStateMachine);

  const createAccount = (values: UserAccountData) => {
    axios
      .post(`${process.env.REACT_APP_API}/auth/create-account`, values)
      .then(res => console.log(res)) //TODO PUSH USER TO CREATED ACC PAGE
      .catch(e => console.log(e));
  };

  return (
    <>
      <header>
        <h1>Sign up</h1>
        <p>Please sign in to continue.</p>
      </header>
      <main>
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
          <Form>
            <TextField
              key="email-input-field"
              name="email"
              placeholder="monke@gmail.com"
              type="email"
            />
            <TextField
              key="first-name-input-field"
              name="firstName"
              placeholder="John"
              type="text"
            />
            <TextField
              key="last-name-input-field"
              name="lastName"
              placeholder="Smith"
              type="text"
            />
            <TextField
              key="password-input-field"
              name="password"
              placeholder="***********"
              type="password"
            />
            <TextField
              key="password_confirm-input-field"
              name="confirmPassword"
              placeholder="***********"
              type="password"
            />

            <button type="submit">Sign Up</button>
          </Form>
        </Formik>
        <button onClick={() => send('SIGN_IN')}>Login in Sign In</button>
      </main>
    </>
  );
};

export default SignUp;
