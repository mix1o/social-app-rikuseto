import styled from 'styled-components';
import ReactSelect from 'react-select';

export const CustomSelect = styled(ReactSelect)`
  .react-select__control {
    margin-block: 2em;
    max-width: ${({ theme }) => theme.formWidth}; //TODO change fixed max width
    background: ${({ theme }) => theme.background600};
    display: flex;
    border: 1px solid ${({ theme }) => theme.background500};
  }
  .react-select__single-value {
    font-size: ${({ theme }) => theme.fs300};
    color: ${({ theme }) => theme.fontColor500};
  }
  .react-select__menu {
    background: ${({ theme }) => theme.background600};
    border: 1px solid ${({ theme }) => theme.background700};
  }
  .react-select__option {
    padding: 1em;
    color: ${({ theme }) => theme.fontColor400};
    font-size: ${({ theme }) => theme.fs200};
    border-bottom: 1px solid ${({ theme }) => theme.background700};
    background: ${({ theme }) => theme.background600};
  }
  .react-select__option:hover {
    background: ${({ theme }) => theme.background700};
  }
  .react-select__option--is-selected {
    background: ${({ theme }) => theme.mainBg500};
  }
`;
//old styles
// const a = {
//   placeholder: () => ({
//     fontSize: '1.4rem',
//     color: 'var(--font-dark-300)',
//   }),
//   container: provided => ({
//     ...provided,
//     background: 'red',
//   }),
//   groupHeading: provided => ({
//     ...provided,
//     fontSize: '1.4rem',
//     padding: '.5rem',
//     marginTop: '-3px',
//   }),
//   noOptionsMessage: provided => ({
//     ...provided,
//     fontSize: '1.2rem',
//   }),
//   input: provided => ({
//     ...provided,
//     color: 'var(--font-dark-600)',
//     fontSize: '1.4rem',
//   }),
//   loadingIndicator: provided => ({
//     ...provided,
//     color: 'var(--main-bg-500)',
//     fontSize: '0.9rem',
//     position: 'absolute',
//     top: '.5rem',
//     right: '4rem',
//   }),
// };
