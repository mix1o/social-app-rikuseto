import axios from 'axios';
import { useDispatch } from 'react-redux';
import { displayEditedPost } from '../features/post-edit';

export const useEditPost = () => {
  const dispatch = useDispatch();
  const editPost = (newHeadline: string, headline: string, _id: string) => {
    if (newHeadline === headline) return;

    axios
      .patch(`${process.env.REACT_APP_API}/posts/edit`, {
        _id,
        newHeadline,
      })
      .then(() => {
        dispatch(displayEditedPost({ isEdit: true, newHeadline, postId: _id }));
      });
  };

  return { editPost };
};
