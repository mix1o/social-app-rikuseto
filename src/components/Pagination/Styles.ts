import styled from 'styled-components';

export const PaginationInfoWrapper = styled.section`
  background: ${({ theme }) => theme.background500};
  padding: 2em;
  border-top: 1px solid ${({ theme }) => theme.borderColor};
`;

export const PaginationContent = styled.div`
  text-align: center;
`;
