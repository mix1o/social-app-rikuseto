import { useField } from 'formik';
import { FC } from 'react';

interface FieldProps {
  key: string;
  placeholder: string;
  name: string;
  type: string;
}

const NormalField: FC<FieldProps> = ({ ...rest }) => {
  const [field, meta] = useField(rest);

  return (
    <label>
      <input {...rest} {...field} />
    </label>
  );
};

export default NormalField;
