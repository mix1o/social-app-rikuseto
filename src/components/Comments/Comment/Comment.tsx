import axios from 'axios';
import React, { FC, useState } from 'react';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { LikedElements } from '../../../hooks/LikedElements';
import { AuthorInterface } from '../../../interfaces/common/common';
import { authorOfComment } from '../../../helpers/AuthorOfComment';
import { SingleCommentProps } from '../../../interfaces/comments/commentsInterfaces';
import moment from 'moment';
import { motion as m } from 'framer-motion';
import { faStar as faStarChonky } from '@fortawesome/free-solid-svg-icons/faStar';
import { faStar as farBellThin } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Comment: FC<SingleCommentProps> = ({
  _id,
  user_id,
  text,
  likes,
  date,
  refreshComments,
}) => {
  const [cookies] = useCookies();
  const { user } = cookies;
  const [liked, setLiked] = useState<boolean | undefined>();
  const [author, setAuthor] = useState<AuthorInterface>();

  const handleLikeComment = () => {
    axios
      .post(`${process.env.REACT_APP_API}/comments/like`, {
        _id,
        userId: user._id,
      })
      .then(() => refreshComments());
  };

  useEffect(() => {
    authorOfComment(user_id).then(res => setAuthor(res));

    const like = LikedElements(user, likes);
    setLiked(like);
  }, [likes]);

  return (
    <div className="comment">
      <div className="comment__author">
        <img
          className="comment__author-image"
          src={author?.avatar}
          alt="user profile"
        />
        <p className="comment__author-name">
          {author?.firstName} {author?.lastName}
        </p>
        <p className="comment__date">{moment(date).fromNow()}</p>
      </div>
      <p className="comment__content">{text}</p>

      <div className="comment__container-likes">
        <m.div
          animate={
            liked ? { color: '#753ee0' } : { color: 'var(--font-dark-600)' }
          }
          className="comment__action"
        >
          <m.button
            whileTap={{ scale: 1.2 }}
            className="comment__btn"
            onClick={() => {
              if (user) {
                handleLikeComment();
              }
            }}
          >
            {liked ? (
              <FontAwesomeIcon icon={faStarChonky} />
            ) : (
              <FontAwesomeIcon icon={farBellThin} />
            )}
          </m.button>
          <p className="comment__likes">{likes.length}</p>
        </m.div>
      </div>
    </div>
  );
};

export default Comment;
