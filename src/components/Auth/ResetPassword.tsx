import { FC } from 'react';
import { useService } from '@xstate/react';
import { authService } from './AuthStateMachine';
import { Form, Formik } from 'formik';
import TextField from '../../Formik/TextField';

const ResetPassword: FC = () => {
  const [, send] = useService(authService);
  return (
    <main className="auth">
      <div className="auth__header">
        <h1>Reset password</h1>
      </div>
      <Formik
        initialValues={{ email: '' }}
        onSubmit={values => console.log(values)}
      >
        <Form className="auth-form">
          <TextField
            key="email-input-field"
            name="email"
            placeholderLabel="monke@gmail.com"
            type="email"
          />
          <button
            type="submit"
            onClick={() => {
              send('RESET_PASSWORD');
            }}
            className="btn auth-form__submit"
          >
            Reset
          </button>
        </Form>
      </Formik>
      <p className="auth__form-link">
        Go back to
        <span className="auth__form-next" onClick={() => send('SIGN_IN')}>
          {' '}
          Login page
        </span>
      </p>
    </main>
  );
};

export default ResetPassword;
