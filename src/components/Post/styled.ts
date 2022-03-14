import styled from 'styled-components';

export const PostWrapper = styled.section`
  background: ${({ theme }) => theme.background600};
  max-width: 401px;
  position: relative;
  margin-bottom: 2rem;
  border-top: 1px solid ${({ theme }) => theme.borderColor};
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
`;

export const PostContent = styled.div`
  padding: ${({ theme }) => theme.paddingAroundPost};
`;

export const PostHeadline = styled.p`
  margin: 0rem 0 3rem 2px;
  font-size: ${({ theme }) => theme.fs300};
  overflow-wrap: break-word;
  font-weight: ${({ theme }) => theme.fw600};
`;

export const PostContainerSocials = styled.div`
  width: 100%;
  text-align: center;
  background-color: transparent;
`;

export const PostSocialText = styled.p`
  font-size: ${({ theme }) => theme.fs250};
  color: ${({ theme }) => theme.fontColor500};
  margin-left: 2px;
`;

export const PostSocialLink = styled.a`
  font-size: ${({ theme }) => theme.fs200};
  color: ${({ theme }) => theme.fontColor400};
  word-wrap: break-word;
  border-radius: 100px;
  margin: 1rem;
  display: inline-block;
  padding: 0;
`;

export const PostImageWrapper = styled.div`
  width: 100%;
  height: auto;
  margin-bottom: 2rem;
`;

export const PostImage = styled.img`
  width: 100%;
  min-height: 30rem;
  max-height: 50rem;
`;

export const Category = styled.p`
  font-size: 1.3rem;
  margin-right: 1rem;
  margin-top: -1rem;
  color: red;
  color: ${({ theme }) => theme.fontColor300};

  span {
    font-weight: ${({ theme }) => theme.fw600};
    color: ${({ theme }) => theme.fontColor500};
  }
`;

export const DotsContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: ${({ theme }) => theme.fontColor500};
  font-size: ${({ theme }) => theme.fs300};
  display: flex;
  background: ${({ theme }) => theme.background600};
  color: ${({ theme }) => theme.fontColor800};
  justify-content: flex-end;
  align-items: flex-end;
  flex-direction: column;
`;
export const Dots = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.fontColor500};
  .fa-ellipsis-v {
    color: inherit;
  }
`;

export const PostActionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
  width: 100%;
  background: transparent;
  margin-right: 5px;
  .fa-flag,
  .fa-ban,
  .fa-edit,
  .fa-trash-alt {
    margin-left: 0.5rem;
  }
`;
export const ActionButton = styled.button<{ warningButton?: boolean }>`
  display: block;
  border: none;
  font-size: ${({ theme }) => theme.fs250};
  color: ${({ theme }) => theme.fontColor200};
  margin: 1rem auto;
  padding: 1rem 2rem;
  background: ${({ theme, warningButton }) =>
    warningButton ? theme.warning500 : theme.mainBg400};
`;

export const ButtonCopy = styled(ActionButton)`
  background: ${({ theme }) => theme.mainBg500};
  padding: 1rem;
  color: ${({ theme }) => theme.fontColor200};

  .fa-copy {
    margin-left: 0.5rem;
  }
`;

export const TopCommentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.borderColor};
`;
export const TopCommentDate = styled.p`
  margin: 0;
  margin-right: 1rem;
  font-size: ${({ theme }) => theme.fs200};
`;
export const TopCommentText = styled.p`
  margin-top: -1rem;
  font-size: ${({ theme }) => theme.fs200};
`;
export const PostInfo = styled.div`
  display: flex;
  justify-content: space-between;
  padding-left: 1rem;
`;

export const PostButton = styled.button`
  font-size: ${({ theme }) => theme.fs250};
  background: transparent;
  margin: 0;
  border: none;
  color: ${({ theme }) => theme.fontColor500};

  span {
    margin-right: 0.5rem;
  }
`;

export const PostBarComments = styled.div<{ isTopComment: boolean }>`
  text-align: center;
  padding: 1rem 0;
  margin: ${({ isTopComment }) =>
    isTopComment ? '0 1rem 0 1rem' : '1rem 1rem 0 1rem'};
  border-top: 1px solid ${({ theme }) => theme.borderColor};

  p {
    margin: 0.5rem;
    font-weight: ${({ theme }) => theme.fw600};
    font-size: ${({ theme }) => theme.fs250};
    color: ${({ theme }) => theme.fontColor500};

    span {
      color: ${({ theme }) => theme.fontActive500};
      font-weight: ${({ theme }) => theme.fw700};
    }
  }
`;

export const PostEditWrapper = styled.div`
  margin-top: 2rem;
  text-align: right;
`;

export const EditInput = styled.input`
  width: 100%;
  padding: 1rem 0.5rem;
  color: ${({ theme }) => theme.fontColor500};
  margin-bottom: 1rem;
  font-size: ${({ theme }) => theme.fs250};
  background-color: transparent;
  outline: none;
  border: 1px solid ${({ theme }) => theme.borderColor};
`;

export const EditMessage = styled.span`
  margin-right: 2rem;
  color: ${({ theme }) => theme.warning500};
  opacity: 0.9;
`;

export const EditContainerButtons = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: end;
`;

export const ButtonEdit = styled(ActionButton)`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.fontColor300};
  font-size: ${({ theme }) => theme.fs200};
  margin: 0.5rem;
`;

export const PostActionDescription = styled.p`
  color: ${props => props.theme.fontColor400};
  font-size: ${props => props.theme.fs300};
  margin-bottom: 0;
`;
export const PostActionLabel = styled.label`
  display: flex;
  align-items: center;
  margin: 1rem 0.5rem;
  font-size: ${({ theme }) => theme.fs200};
`;
export const PostActionInput = styled.input`
  margin-right: 0.5rem;
`;
