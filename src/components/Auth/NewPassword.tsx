import { Formik, Form } from 'formik';
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import TextField from '../FormFields/TextField';
import { Link } from 'react-router-dom';
import { newPasswordValidation } from '../../validations/newPassword';

const NewPassword: FC = () => {
  const { token } = useParams<{ token: string }>();
  const { reset } = useAuth();

  return (
    <main className="auth__main">
      <div className="auth__container-form">
        <Formik
          initialValues={{
            password: '',
            confirmPassword: '',
          }}
          validationSchema={newPasswordValidation}
          onSubmit={values =>
            reset({
              step: 2,
              confirmPassword: values.confirmPassword,
              password: values.password,
              token,
            })
          }
        >
          <Form className="auth-form">
            <h2 className="auth__heading">Set your new password</h2>
            <TextField
              type="password"
              key="password"
              name="password"
              label="New password"
            />
            <TextField
              type="password"
              key="confirmPassword"
              name="confirmPassword"
              label="Confirm new password"
            />
            <div className="auth__container-btns">
              <Link to="/" className="btn">
                Back to main
              </Link>
              <button type="submit" className="btn auth__change-btn">
                Change password
              </button>
            </div>
            {/* <p
              className={`${
                message.status === 200
                  ? 'auth__message--accepted'
                  : 'auth__message--refused'
              } auth__message`}
            >
              {message.message}
            </p> */}
          </Form>
        </Formik>
      </div>
    </main>
  );
};
export default NewPassword;
