import { Form, Formik, validateYupSchema } from 'formik';
import { FC } from 'react';
import TextField from '../../Formik/TextField';
import { AuthSchema } from '../../Formik/ValidationSchemas';

const SignIn: FC = () => {
  return (
    <>
      <header>
        <h1>Login</h1>
        <p>Please sign in to continue.</p>
      </header>
      <main>
        <Formik
          initialValues={{ email: '', password: '' }}
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
              type="password"
            />
            <button type="submit">Sign In</button>
          </Form>
        </Formik>
      </main>
    </>
  );
};

export default SignIn;
