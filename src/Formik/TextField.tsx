import { useField } from 'formik';
import { FC, useState } from 'react';
import parsePhoneNumber from 'libphonenumber-js';

interface FieldProps {
  key: string;
  placeholder: string;
  name: string;
  type: string;
}

const TextField: FC<FieldProps> = ({ ...rest }) => {
  const [field, meta] = useField(rest);
  const [number, setNumber] = useState<number>();
  const error = meta.touched && meta.error ? meta.error : '';

  return (
    <label>
      <input {...rest} {...field} />
      <p>{error}</p>
    </label>
  );
};

export default TextField;
