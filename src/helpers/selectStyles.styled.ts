export const mainSelect = {
  option: () => ({
    background: 'var(--light-bg-600)',
    padding: '1rem',
    color: 'var(--font-dark-600)',
    fontSize: '12px',
    borderBottom: '1px solid var(--light-bg-700)',
  }),
  singleValue: () => ({
    fontSize: '12px',
    color: 'var(--font-dark-600)',
  }),
  menu: (provided: any) => ({
    ...provided,
    background: 'var(--light-bg-600)',
  }),
  control: () => ({
    width: '100%',
    background: 'var(--light-bg-600)',
    display: 'flex',
    border: '1px solid var(--light-bg-700)',
    color: 'var(--font-dark-600)',
  }),
  placeholder: () => ({
    fontSize: '12px',
    color: 'var(--font-dark-300)',
  }),
};
