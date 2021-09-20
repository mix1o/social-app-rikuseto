import axios from 'axios';
import { FC, useState, ChangeEvent, useEffect, useRef, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { LikedElements } from '../../../hooks/LikedElements';
import { AuthorInterface } from '../../../interfaces/common/common';
import { authorOfComment } from '../../../helpers/AuthorOfComment';
import { SingleCommentProps } from '../../../interfaces/comments/commentsInterfaces';
import { motion as m } from 'framer-motion';
import { faStar as faStarChonky } from '@fortawesome/free-solid-svg-icons/faStar';
import { faStar as farBellThin } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useLocation } from 'react-router-dom';
import { BlurredMenu } from '../../Animations/Popup';
import Floater from 'react-floater';
import { useCounter } from '../../../store/sub';
import { CookieUser } from '../../../interfaces/auth/authInterface';
import { AnimatePresence as Presence } from 'framer-motion';

const Comment: FC<SingleCommentProps> = ({
  _id,
  userId,
  text,
  likes,
  date,
  refreshComments,
  fetchTopComment,
  scroll,
}) => {
  const [cookies] = useCookies();
  const user: CookieUser = useMemo(
    () => (cookies['user'] ? { ...cookies['user'] } : undefined),
    [cookies]
  );

  const [liked, setLiked] = useState<boolean | undefined>();
  const [author, setAuthor] = useState<AuthorInterface>();
  const [popup, setPopup] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [newText, setNewText] = useState<string>(text);
  const [message, setMessage] = useState<string>('');
  const [openToolTip, setOpenToolTip] = useState<boolean>(false);
  const location = useLocation();
  const [state] = useCounter();

  dayjs.extend(relativeTime);

  const commentRef = useRef<any>();
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
    authorOfComment(userId).then(res => setAuthor(res));
    const like = LikedElements(user, likes);
    setLiked(like);
  }, [likes]);

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

  useEffect(() => {
    if (scroll) {
      setTimeout(() => {
        commentRef.current.scrollIntoView({ block: 'center' });
        commentRef.current.style.boxShadow = '0 0 1rem 1px #753ee0';
        commentRef.current.style.padding = '10px';
      }, 500);
    }
  }, [scroll]);

  const ActionsComment = () => {
    return (
      <div className="comment__container-dots-actions">
        {user && user._id !== userId && (
          <button className="comment__action-dot">
            Report<i style={{ marginLeft: '.5rem' }} className="fas fa-ban"></i>
          </button>
        )}
        {user && user._id === userId ? (
          <>
            <button
              onClick={() => setIsEdit(true)}
              className="comment__action-dot"
            >
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

  const editComment = () => {
    if (newText === text) {
      setMessage('First you need to edit your post');
      return;
    }
    axios
      .patch(`${process.env.REACT_APP_API}/comments/edit`, {
        _id,
        newText,
      })
      .then(() => {
        setIsEdit(false);
        refreshComments();
      });
  };

  return (
    <>
      <div
        ref={commentRef}
        className={`comment ${lastChildManipulation() ? 'comment--last' : ''}`}
      >
        {user && (
          <div
            onClick={() => setOpenToolTip(prevState => !prevState)}
            className="comment__container-dots"
          >
            <Floater
              offset={0}
              open={openToolTip}
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
        )}
        <div className="comment__author">
          <img
            className="comment__author-image"
            src={author?.avatar}
            alt="user profile"
          />
          <p className="comment__author-name">
            {author?.firstName} {author?.lastName}
          </p>
          <p className="comment__date">{dayjs(date).fromNow()}</p>
        </div>
        {!isEdit && <p className="comment__content">{text}</p>}
        {isEdit && (
          <div className="post__edit-input-container">
            <input
              className="post__edit-input"
              value={newText}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewText(e.target.value)
              }
              type="text"
            />
            <span className="post__edit-message">{message}</span>

            <button
              onClick={editComment}
              className="post__edit-button post__edit-button--edit"
            >
              Edit
            </button>
            <button
              className="post__edit-button"
              onClick={() => {
                setIsEdit(false);
                setMessage('');
              }}
            >
              Cancel
            </button>
          </div>
        )}
        <div className="comment__container-likes">
          <m.div
            animate={{
              color: liked ? '#753ee0' : state.theme ? '#f8f8f8' : '#36344b',
            }}
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
      <Presence initial={false} exitBeforeEnter>
        {popup && <BlurredMenu stateHandler={setPopup} />}
      </Presence>
    </>
  );
};

export default Comment;
