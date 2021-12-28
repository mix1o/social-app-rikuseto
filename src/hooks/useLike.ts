import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { LikedElement } from '../enums/LikedElement';
import debounce from 'lodash/debounce';

export const useLikeButton = (
  likes: string[],
  id: string,
  type: LikedElement
) => {
  const [cookies] = useCookies();
  const { user } = cookies;

  const [isLiked, setIsLiked] = useState(false);
  const [likesCounter, setLikesCounter] = useState(likes.length);

  useEffect(() => {
    if (user && likes.length > 0) {
      const isPostLikedByUser = () => {
        const index = likes.findIndex((userId: string) => userId === user._id);
        index === -1 ? setIsLiked(false) : setIsLiked(true);
      };

      isPostLikedByUser();
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
      alert('You need to log in');
      return;
    }

    if (!isLiked) setLikesCounter(oldLike => oldLike + 1);
    if (isLiked) setLikesCounter(oldLike => oldLike - 1);

    setIsLiked(prevState => !prevState);

    updateLikePost();
  };

  return {
    handleLikePost,
    isLiked,
    likesCounter,
  };
};
