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
import { useLocation } from 'react-router-dom';
import BlurredMenu from '../../Navigation/BlurredMenu';
import Floater from 'react-floater';

const Comment: FC<SingleCommentProps> = ({
  _id,
  user_id,
  text,
  likes,
  date,
  refreshComments,
  fetchTopComment,
}) => {
  const [cookies] = useCookies();
  const { user } = cookies;
  const [liked, setLiked] = useState<boolean | undefined>();
  const [author, setAuthor] = useState<AuthorInterface>();
  const [popup, setPopup] = useState<boolean>(false);

  const [displayMessage, setDisplayMessage] = useState<boolean>(false);

  const handleLikeComment = () => {
    if (!user) {
      setPopup(true);
      return;
    }
    axios
      .post(`${process.env.REACT_APP_API}/comments/like`, {
        _id,
        userId: user._id,
      })
      .then(() => {
        refreshComments();
        fetchTopComment();
      });
  };

  useEffect(() => {
    authorOfComment(user_id).then(res => setAuthor(res));

    const like = LikedElements(user, likes);
    setLiked(like);
  }, [likes]);

  const location = useLocation();

  const lastChildManipulation = () => {
    if (location.pathname.includes('post')) {
      return true;
    }
    return false;
  };

  const deleteComment = () => {
    setDisplayMessage(true);
    axios.delete(`${process.env.REACT_APP_API}/comments/delete`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        _id,
      },
    });

    setTimeout(() => {
      setDisplayMessage(false);
      refreshComments();
      fetchTopComment();
    }, 500);
  };

  const ActionsComment = () => {
    return (
      <div className="comment__container-dots-actions">
        <button className="comment__action-dot">
          Report<i style={{ marginLeft: '.5rem' }} className="fas fa-ban"></i>
        </button>
        {user._id === user_id ? (
          <>
            <button className="comment__action-dot">
              Edit
              <i style={{ marginLeft: '.5rem' }} className="fas fa-edit"></i>
            </button>
            <button
              onClick={deleteComment}
              className="comment__action-dot comment__action--delete"
            >
              Delete
              <i
                style={{ marginLeft: '.5rem' }}
                className="fas fa-trash-alt"
              ></i>
            </button>
          </>
        ) : null}
      </div>
    );
  };

  return (
    <>
      <div
        className={`comment ${lastChildManipulation() ? 'comment--last' : ''}`}
      >
        <div className="comment__container-dots">
          <Floater
            offset={0}
            placement="right-start"
            styles={{
              floater: {
                filter: 'none',
              },
              container: {
                background: 'transparent',
                color: 'var(--font-dark-600)',
                filter: 'none',
                minHeight: 'none',
                minWidth: 100,
                textAlign: 'right',
                padding: 0,
              },
              arrow: {
                color: 'var(--light-bg-700)',
                length: 8,
                spread: 10,
              },
            }}
            content={ActionsComment()}
          >
            <button
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--font-dark-600)',
              }}
            >
              <i className="fas fa-ellipsis-v"></i>
            </button>
          </Floater>
        </div>
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
            animate={liked ? { color: '#753ee0' } : { color: 'inherit' }}
            className="comment__action"
          >
            <m.button
              whileTap={{ scale: 1.2 }}
              className="comment__btn"
              onClick={() => {
                handleLikeComment();
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
        {displayMessage && <p className="comment__information">Deleting...</p>}
      </div>
      {popup && <BlurredMenu setUserOption={setPopup} />}
    </>
  );
};

export default Comment;
