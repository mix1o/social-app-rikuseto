import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { LikedElement } from '../enums/LikedElement';
import debounce from 'lodash/debounce';
import { useDispatch } from 'react-redux';
import { ModalType, openModal } from '../features/modalSlice';
import { useUser } from './useUser';

export const useLike = (likes: string[], id: string, type: LikedElement) => {
  const { user } = useUser();

  const [isLiked, setIsLiked] = useState(false);
  const [likesCounter, setLikesCounter] = useState(likes.length);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user && likes.length > 0) {
      const index = likes.findIndex((userId: string) => userId === user._id);
      index === -1 ? setIsLiked(false) : setIsLiked(true);
    }
  }, [likes, user]);

  const updateLikePost = useCallback(
    debounce(async () => {
      try {
        //TODO Rename backend id
        //TODO Implement useMutation
        await axios.post(`${process.env.REACT_APP_API}/${type}/like`, {
          [type === LikedElement.Post ? 'postId' : '_id']: id,
          userId: user._id,
        });
      } catch (e) {
        setLikesCounter(likesCounter);
        setIsLiked(prevState => !prevState);
        throw new Error('Ups...'); //TODO: Snackbar component
      }
    }, 1000),
    []
  );

  const handleLikePost = async () => {
    if (!user) {
      dispatch(openModal({ type: ModalType.LOG_IN }));
      return;
    }

    if (!isLiked) setLikesCounter(oldLikeCounter => oldLikeCounter + 1);
    if (isLiked) setLikesCounter(oldLikeCounter => oldLikeCounter - 1);

    setIsLiked(prevState => !prevState);

    updateLikePost();
  };

  return {
    handleLikePost,
    isLiked,
    likesCounter,
  };
};
