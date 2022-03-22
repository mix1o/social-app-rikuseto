import axios from 'axios';
import { Dispatch, FC, SetStateAction, useState, useEffect } from 'react';
import { usePostActions } from '../../hooks/usePostActions';
import { useUser } from '../../hooks/useUser';
import {
  ActionButton,
  PostActionDescription,
  PostActionInput,
  PostActionLabel,
  PostActionsWrapper,
} from './styled';

interface PostActionsI {
  id: string;
  userId: string;
}

const PostActions: FC<PostActionsI> = ({ id, userId }) => {
  const { user } = useUser();
  const { isSavedPost, savePost, deletePost } = usePostActions(id);

  return (
    <PostActionsWrapper>
      {user && user._id !== userId && (
        <>
          <PostActionDescription>
            You can save favorites posts.
          </PostActionDescription>
          <ActionButton
            onClick={() => {
              savePost();
            }}
          >
            {isSavedPost ? 'Unsave' : 'Save post'}
            <i className="fas fa-flag"></i>
          </ActionButton>

          <PostActionDescription>Select options bellow</PostActionDescription>
          <PostActionLabel>
            <PostActionInput
              value="option 1"
              name="report-option"
              type="radio"
            />
            Option 1
          </PostActionLabel>
          <PostActionLabel>
            <PostActionInput
              value="option 2"
              name="report-option"
              type="radio"
            />
            Option 2
          </PostActionLabel>
          <PostActionLabel>
            <PostActionInput
              value="option 3"
              name="report-option"
              type="radio"
            />
            Option 3
          </PostActionLabel>
          <ActionButton>
            {/* TODO add function report */}
            Submit report
            <i className="fas fa-ban"></i>
          </ActionButton>
        </>
      )}
      {user && user._id === userId ? (
        <>
          <PostActionDescription>
            You can easily modify your post whenever want
          </PostActionDescription>
          <ActionButton>
            Edit
            <i className="fas fa-edit"></i>
          </ActionButton>
          <PostActionDescription>
            Delete post. This action is permanent
          </PostActionDescription>
          <ActionButton warningButton={true} onClick={deletePost}>
            Delete
            <i className="fas fa-trash-alt"></i>
          </ActionButton>
        </>
      ) : null}
    </PostActionsWrapper>
  );
};

export default PostActions;
