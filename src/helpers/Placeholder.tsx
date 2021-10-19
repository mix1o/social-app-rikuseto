import styled from 'styled-components';

export const Placeholder = styled.label<{ focus: boolean }>`
  top: ${({ focus }) => (focus ? '-1.8rem' : '1.2rem')};
  left: ${({ focus }) => (focus ? '0' : '1rem')};
  font-size: ${({ focus }) => (focus ? '1.2rem' : '1.6rem')};
  font-weight: ${({ focus }) => (focus ? '600' : '400')};
  color: ${({ focus }) => (focus ? '#753ee0' : '#656285')};
`;
