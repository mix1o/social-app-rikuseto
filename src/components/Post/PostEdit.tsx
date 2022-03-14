import { Dispatch, ChangeEvent, SetStateAction, useState } from 'react';
import { useEditPost } from '../../hooks/useEditPost';
import {
  ButtonEdit,
  EditContainerButtons,
  EditInput,
  EditMessage,
  PostEditWrapper,
} from './styled';

const PostEdit = ({
  setIsEdit,
  headline,
  _id,
}: {
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  headline: string;
  _id: string;
}) => {
  const { editPost } = useEditPost();
  const [newHeadline, setNewHeadline] = useState('');
  const [message, setMessage] = useState('');

  return (
    <PostEditWrapper>
      <EditInput
        value={newHeadline}
        placeholder="Change headline"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setNewHeadline(e.target.value)
        }
        type="text"
      />

      <EditMessage>{message}</EditMessage>
      <EditContainerButtons>
        <ButtonEdit onClick={() => editPost(newHeadline, headline, _id)}>
          Edit
        </ButtonEdit>
        <ButtonEdit
          onClick={() => {
            setIsEdit(false);
            setMessage('');
          }}
        >
          Cancel
        </ButtonEdit>
      </EditContainerButtons>
    </PostEditWrapper>
  );
};

export default PostEdit;
