import axios from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useMutation } from 'react-query';

export const useLikeButton = (likes: string[], postId: string) => {
  const [cookies] = useCookies();
  const { user } = cookies;

  const [isLiked, setIsLiked] = useState<boolean>();
  const [likesCounter, setLikesCounter] = useState(likes.length);

  useEffect(() => {
    if (!user && likes.length > 0) return;

    const isPostLikedByUser = () => {
      const index = likes.findIndex((userId: string) => userId === user._id);
      index === -1 ? setIsLiked(false) : setIsLiked(true);
    };

    isPostLikedByUser();
  }, [likes, user]);

  const updateLikePost = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API}/posts/like`, {
        postId,
        userId: user._id,
      });
    } catch (e) {
      return false;
    }
  };

  const likePost = async () => {
    if (!user) return;

    if (!isLiked) setLikesCounter(likesCounter + 1);
    if (isLiked) setLikesCounter(likesCounter - 1);

    setIsLiked(prevState => !prevState);

    updateLikePost();
  };

  return {
    likePost,
    isLiked,
    likesCounter,
  };
};
