import { Form, Formik } from 'formik';
import { FC } from 'react';
import TextField from '../../Formik/TextField';
import { AuthSchema } from '../../Formik/ValidationSchemas';

const SignUp: FC = () => {
  return (
    <>
      <header>
        <h1>Login</h1>
        <p>Please sign in to continue.</p>
      </header>
      <main>
        <Formik
          initialValues={{
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
          }}
          onSubmit={values => console.log(values)}
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
              key="password-input-field"
              name="password"
              placeholder="***********"
              type="text"
            />
            <TextField
              key="password_confirm-input-field"
              name="confirmPassword"
              placeholder="***********"
              type="text"
            />
            <TextField
              key="phone_number-input-field"
              name="phone"
              placeholder="123-513-512"
              type="phone"
            />
            <button type="submit">Sign Up</button>
          </Form>
        </Formik>
      </main>
    </>
  );
};

export default SignUp;
