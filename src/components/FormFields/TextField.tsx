import { useField } from 'formik';
import { FC, useState } from 'react';
import { Placeholder } from '../../helpers/placeholder';

interface FieldProps {
  key: string;
  label: string;
  name: string;
  type: string;
  id?: string;
}

const TextField: FC<FieldProps> = ({ ...rest }) => {
  const [field, meta] = useField(rest);
  const error = meta.touched && meta.error ? meta.error : '';

  const [focus, setFocus] = useState(false);
  return (
    <label
      className="auth-form__wrapper"
      onFocus={() => setFocus(!focus)}
      onBlur={() => setFocus(!focus)}
    >
      <Placeholder
        className="auth-form__label"
        focus={focus || meta.touched || meta.value}
      >
        {error ? null : rest.label}
        <span className="auth-form__error" data-testid="message">
          {error}
        </span>
      </Placeholder>
      <input
        {...rest}
        {...field}
        placeholder={rest.label}
        className={`auth-form__input ${
          error ? 'auth-form__input--error' : null
        }`}
      />
    </label>
  );
};

export default TextField;
