import { Form, Formik } from 'formik';
import TextField from '../../components/FormFields/TextField';
import axios from 'axios';
import { Placeholder } from '../../helpers/placeholder';
import { useState } from 'react';
import { contactSchema } from '../../validations/contactSchema';

const Contact = () => {
  const [movePlaceholder, setMovePlaceholder] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (values: {
    message: string;
    email: string;
    name: string;
  }) => {
    console.log(values);

    const response = await axios.post(
      `${process.env.REACT_APP_API}/contact-us`,
      values
    );
    setMessage(response.data.message);

    if (response.status === 200)
      setTimeout(() => {
        window.location.href = '/';
      }, 5000);
  };

  return (
    <main className="contact">
      <h1 className="contact__header">Contact Us</h1>
      <section className="contact__form">
        <Formik
          initialValues={{ name: '', email: '', message: '' }}
          onSubmit={handleSubmit}
          validationSchema={contactSchema}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form className="contact__form auth-form">
              <TextField name="name" label="Your name" type="text" key="name" />
              <TextField
                name="email"
                label="Your email address"
                type="email"
                key="email"
                className="contact__child"
              />
              {errors && touched.message && (
                <Placeholder focus={movePlaceholder}>
                  <span className="contact__error">{errors.message}</span>
                </Placeholder>
              )}
              <textarea
                name="message"
                placeholder="Message.."
                key="textarea"
                onChange={change => {
                  handleChange(change);
                  setMovePlaceholder(true);
                }}
                onBlur={change => {
                  handleBlur(change);
                  setMovePlaceholder(false);
                }}
                value={values.message}
                className={`contact__textarea textarea__input ${
                  errors.message ? 'contact__textarea-error' : null
                }`}
              ></textarea>

              <button type="submit" className="contact__submit">
                Send Message
              </button>
              {message && (
                <p className="contact__message">
                  {message} (You will be redirected in a second)
                </p>
              )}
            </Form>
          )}
        </Formik>
      </section>
    </main>
  );
};

export default Contact;
