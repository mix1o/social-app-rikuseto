import { useField } from 'formik';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

interface FieldProps {
  key: string;
  label: string;
  name: string;
  type: string;
  id?: string;
}

const Placeholder = styled.label<{ focus: boolean }>`
  top: ${({ focus }) => (focus ? '-1.8rem' : '1.2rem')};
  left: ${({ focus }) => (focus ? '0' : '1rem')};
  font-size: ${({ focus }) => (focus ? '1.2rem' : '1.6rem')};
  font-weight: ${({ focus }) => (focus ? '600' : '400')};
  color: ${({ focus }) => (focus ? '#753ee0' : '#656285')};
`;

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
      <Placeholder className="auth-form__label" focus={focus || meta.touched}>
        {rest.label}{' '}
        <span className="auth-form__error">{error}</span>
      </Placeholder>
      <input
        {...rest}
        {...field}
        className={`auth-form__input ${
          error ? 'auth-form__input--error' : null
        }`}
      />
    </label>
  );
};

export default TextField;
