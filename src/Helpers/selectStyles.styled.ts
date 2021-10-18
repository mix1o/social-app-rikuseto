import { StylesConfig } from 'react-select';

type singleOptions = {
  label: string;
  options: { label: string; value: string | number }[] | any;
  value?: string;
};

export const mainSelect: StylesConfig<
  singleOptions | { label: string; value: string },
  false
> = {
  option: (provided, state) => ({
    background: state.isSelected
      ? 'var(--main-bg-500)'
      : state.isFocused
      ? 'var(--light-bg-700)'
      : 'var(--light-bg-600)',
    padding: '1rem',
    color: 'var(--font-dark-600)',
    fontSize: '1.2rem',
    borderBottom: '1px solid var(--light-bg-700)',
  }),
  singleValue: () => ({
    fontSize: '1.4rem',
    color: 'var(--font-dark-600)',
  }),
  menu: provided => ({
    ...provided,
    background: 'var(--light-bg-600)',
    border: '1px solid var(--light-bg-700)',
  }),
  control: () => ({
    width: '100%',
    background: 'var(--light-bg-600)',
    display: 'flex',
    border: '1px solid var(--light-bg-700)',
    color: 'var(--font-dark-600)',
  }),
  placeholder: () => ({
    fontSize: '1.4rem',
    color: 'var(--font-dark-300)',
  }),
  container: provided => ({
    ...provided,
    background: 'red',
  }),
  groupHeading: provided => ({
    ...provided,
    fontSize: '1.4rem',
    padding: '.5rem',
    marginTop: '-3px',
  }),
  noOptionsMessage: provided => ({
    ...provided,
    fontSize: '1.2rem',
  }),
  input: provided => ({
    ...provided,
    color: 'var(--font-dark-600)',
    fontSize: '1.4rem',
  }),
  loadingIndicator: provided => ({
    ...provided,
    color: 'var(--main-bg-500)',
    fontSize: '0.9rem',
    position: 'absolute',
    top: '.5rem',
    right: '4rem',
  }),
};
