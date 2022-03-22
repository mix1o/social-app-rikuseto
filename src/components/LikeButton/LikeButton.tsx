import { motion as m, AnimatePresence as Presence } from 'framer-motion';
import { useState } from 'react';
import { faStar as faStarChonky } from '@fortawesome/free-solid-svg-icons/faStar';
import { faStar as farBellThin } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLikeButton } from '../../hooks/useLike';
import { LikedElement } from '../../enums/LikedElement';

interface Props {
  likes: string[];
  postId: string;
}

const LikeButton = ({ likes, postId }: Props) => {
  const { handleLikePost, isLiked, likesCounter } = useLikeButton(
    likes,
    postId,
    LikedElement.Post
  );

  return (
    <m.div
      className="post__container-likes"
      animate={{
        color: isLiked ? '#753ee0' : '#36344b',
      }}
    >
      <m.button
        className="post__btn"
        whileTap={{ scale: 1.2 }}
        onClick={handleLikePost}
        aria-label="like or dislike post"
        type="button"
      >
        {isLiked ? (
          <FontAwesomeIcon icon={faStarChonky} />
        ) : (
          <FontAwesomeIcon icon={farBellThin} />
        )}
      </m.button>
      <span className="post__likes">{likesCounter}</span>
    </m.div>
  );
};

export default LikeButton;
