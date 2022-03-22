import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
`;

export const Image = styled.img`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 100%;
  margin-right: 1rem;
`;

export const FullName = styled.p`
  font-size: ${({ theme }) => theme.fs250};
  font-weight: ${({ theme }) => theme.fw600};
  color: ${({ theme }) => theme.fontColor500};

  span {
    color: ${({ theme }) => theme.fontColor300};
    font-weight: ${({ theme }) => theme.fw400};
    font-style: italic;
  }
`;
