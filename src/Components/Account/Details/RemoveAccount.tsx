import { Form, Formik } from 'formik';
import { useCookies } from 'react-cookie';
import { useAuth } from '../../../Hooks/useAuth';
import { CookieUser } from '../../../Interfaces/auth/authInterface';
import { deleteAccountSchema } from '../../../Validations/UserDetailsSchema';
import TextField from '../../FormFields/TextField';

const RemoveAccount = () => {
  const [cookies] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;

  const { removeAccount, message, loading } = useAuth();

  return (
    <section className="details__popup">
      <h3 className="details__description">
        Are you sure you want to do this?
      </h3>
      <p>
        We will immediately delete your account, along with all of your friends,
        saved posts, categories and private messages.
      </p>
      <Formik
        initialValues={{
          email: '',
          password: '',
          verifyText: '',
          userId: user._id,
        }}
        onSubmit={values => removeAccount(values)}
        validationSchema={() => deleteAccountSchema(user.email)}
      >
        <Form className="auth-form">
          <TextField
            name="email"
            label="Your email"
            type="email"
            id="email"
            key="email-field"
          />
          <TextField
            name="password"
            label="Confirm your password"
            type="password"
            id="password"
            key="passwword-field"
          />
          <TextField
            name="verifyText"
            label="To verify, type: delete my account below:"
            type="text"
            id="verifyText"
            key="verifyText-field"
          />
          <p
            className={`auth__message ${
              message.status === 200
                ? 'auth__message--accepted'
                : 'auth__message--refused'
            }`}
          >
            {message.message}
          </p>
          <button type="submit" disabled={loading}>
            Delete this account
          </button>
        </Form>
      </Formik>
    </section>
  );
};

export default RemoveAccount;
