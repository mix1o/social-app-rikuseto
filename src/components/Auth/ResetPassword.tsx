import { FC } from 'react';
import { useActor } from '@xstate/react';
import { authService } from './AuthStateMachine';
import { Form, Formik } from 'formik';
import TextField from '../FormFields/TextField';
import { useAuth } from '../../hooks/useAuth';
import { resetSchema } from '../../validations/authSchemas';

const ResetPassword: FC = () => {
  const [, send] = useActor(authService);

  const { resetPassword } = useAuth();

  return (
    <>
      <main className="auth__main">
        <div className="auth__header">
          <h1>Reset password</h1>
        </div>
        <Formik
          initialValues={{ email: '' }}
          onSubmit={values => resetPassword(values.email)}
          validationSchema={resetSchema}
        >
          <Form className="auth-form">
            <TextField
              key="email-input-field"
              name="email"
              label="monke@gmail.com"
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
        {/* {message && <p className="auth__message">{message}</p>} */}
        <p className="auth__form-link">
          Go back to
          <span className="auth__form-next" onClick={() => send('SIGN_IN')}>
            {' '}
            Login
          </span>
        </p>
      </main>
    </>
  );
};

export default ResetPassword;
