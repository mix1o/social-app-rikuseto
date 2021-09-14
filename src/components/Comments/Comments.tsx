import axios from 'axios';
import { FC, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';
import Comment from './Comment/Comment';
import { motion as m } from 'framer-motion';
import {
  CommentsData,
  CommentProps,
} from '../../interfaces/comments/commentsInterfaces';
import { useCounter } from '../../store/sub';
import BlurredMenu from '../Navigation/BlurredMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import CustomTextarea from '../../helpers/CustomTextarea';

const commentVariant = {
  hidden: {
    y: 1000,
    opacity: 0,
    transition: {
      type: 'tween',
    },
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'tween',
    },
  },
};

interface SortedElement {
  date: string;
  likes: string[];
  postId: string;
  text: string;
  userId: string;
  _id: string;
}

type FilterTypes = 'popular' | 'latest' | 'default';

const Comments: FC<CommentProps> = ({
  postId,
  setOpenComments,
  authorId: postAuthorId,
  fetchTopComment,
  view = false,
}) => {
  const [commentText, setCommentText] = useState<string>('');
  const [comments, setComments] = useState<CommentsData[]>();
  const [filter, setFilter] = useState<string>('default');
  const [popup, setPopup] = useState<boolean>(false);

  const commentRef = useRef<any>();
  const [, actions] = useCounter();
  const [cookies] = useCookies();
  const { user } = cookies;

  const commentId = window.location.href.split('#')[1];

  const MODE_POPULAR = 'popular';
  const MODE_LATEST = 'latest';
  const MODE_DEFAULT = 'default';

  const handleNewComment = (): void => {
    if (!user) {
      setPopup(true);
      return;
    }

    axios
      .post(`${process.env.REACT_APP_API}/comments/create`, {
        commentText,
        postId,
        userId: user._id,
        postAuthorId,
      })
      .then(() => {
        setCommentText('');
        getAllComments();
        fetchTopComment();
        setTimeout(() => {
          commentRef.current.scrollTo({
            top: commentRef.current.scrollHeight,
            behavior: 'smooth',
          });
        }, 300);
      });
  };

  const getAllComments = (): void => {
    axios
      .get(`${process.env.REACT_APP_API}/comments?postId=${postId}`)
      .then(res => setComments(res.data));
  };

  useEffect(() => {
    getAllComments();
  }, []);

  useEffect(() => {
    actions.isOpenComment(true);
  }, []);

  const sortComments = (a: SortedElement, b: SortedElement): number => {
    if (filter === MODE_POPULAR) {
      return b.likes.length - a.likes.length;
    }
    if (filter === MODE_LATEST) {
      return new Date(a.date) > new Date(b.date) ? -1 : 1;
    }

    if (filter === '' || filter === MODE_DEFAULT) {
      return 1;
    }

    return 1;
  };
  const [open, setOpen] = useState(false);
  const handleFilterChange = (type: FilterTypes) => {
    setFilter(type);
    setOpen(false);
  };

  return (
    <m.section
      variants={commentVariant}
      initial="hidden"
      animate="show"
      exit="hidden"
      className={view ? 'comments-shared' : 'comments'}
      ref={commentRef}
    >
      <div>
        <div className="comments__header">
          <div>
            {comments?.length! > 0 && (
              <>
                <div className="comments__filter">
                  <div className="comments__current-filter">
                    <p
                      onClick={() => setOpen(!open)}
                      className="comments__filter-text"
                    >
                      {filter}
                    </p>
                    {!open && (
                      <button
                        className="comments__toggle-filter"
                        onClick={() => setOpen(true)}
                      >
                        <i className="fas fa-chevron-down" />
                      </button>
                    )}
                    {open && (
                      <button
                        className="comments__toggle-filter"
                        onClick={() => setOpen(false)}
                      >
                        <i className="fas fa-chevron-up" />
                      </button>
                    )}
                  </div>
                  {open && (
                    <div className="comments__filter-list">
                      <button
                        className="comments__filter-item"
                        onClick={() => handleFilterChange('default')}
                      >
                        Default
                      </button>

                      <button
                        className="comments__filter-item"
                        onClick={() => handleFilterChange('popular')}
                      >
                        Most popular
                      </button>

                      <button
                        className="comments__filter-item"
                        onClick={() => handleFilterChange('latest')}
                      >
                        Latest
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <button
            className="comments__close-btn"
            onClick={() => {
              setOpenComments(false);
              actions.isOpenComment(false);
            }}
          >
            <FontAwesomeIcon className="comments__icon" icon={faTimesCircle} />
          </button>
        </div>
        <div className="comments__container">
          {comments
            ?.sort(sortComments)
            .map(({ _id, text, userId, likes, date }) => {
              return (
                <Comment
                  key={_id}
                  _id={_id}
                  text={text}
                  userId={userId}
                  likes={likes}
                  date={date}
                  refreshComments={getAllComments}
                  fetchTopComment={fetchTopComment}
                  scroll={commentId === _id ? true : false}
                />
              );
            })}
          {comments?.length === 0 && (
            <p className="comments__info">No comments yet</p>
          )}
        </div>
      </div>
      {user && (
        <CustomTextarea
          textValue={commentText}
          setTextValue={setCommentText}
          handleAction={handleNewComment}
          img={user.avatar}
          placeholder={`Add comment as ${user.firstName} ${user.lastName}`}
        />
      )}
      {popup && <BlurredMenu setUserOption={setPopup} />}
    </m.section>
  );
};

export default Comments;
