import axios from 'axios';
import { ChangeEvent, FC, useRef, useState } from 'react';
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
import Picker from 'emoji-picker-react';

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
  post_id: string;
  text: string;
  user_id: string;
  _id: string;
}

const Comments: FC<CommentProps> = ({
  postId,
  setOpenComments,
  fetchTopComment,
  view = false,
}) => {
  const [commentText, setCommentText] = useState<string>('');
  const [comments, setComments] = useState<CommentsData[]>();
  const [cookies] = useCookies();
  const { user } = cookies;
  const [popup, setPopup] = useState<boolean>(false);
  const commentRef = useRef<any>();
  const [message, setMessage] = useState<string>('');
  const [state, actions] = useCounter();
  const [openEmojiList, setOpenEmojiList] = useState<boolean>(false);

  const handleNewComment = (): void => {
    if (!user) {
      setPopup(true);
      return;
    }
    if (
      commentText.length >= 2 ||
      (commentText.length >= 1 &&
        (/\d/.test(commentText) ||
          /[a-zA-Z]/g.test(commentText) ||
          /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(commentText)))
    ) {
      axios
        .post(`${process.env.REACT_APP_API}/comments/create`, {
          commentText,
          postId,
          userId: user._id,
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
          setOpenEmojiList(false);
        });
      return;
    }
    setMessage('Text must be at least 1 character');
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

  const onEmojiClick = (event: any, emojiObject: any) => {
    setCommentText(prevState => prevState + emojiObject.emoji);
    console.log(emojiObject);
  };

  const MODE_POPULAR = 'popular';
  const MODE_LATEST = 'latest';
  const MODE_DEFAULT = 'default';

  const [filter, setFilter] = useState<string>('Default');

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
          <div className="comments__filter-container">
            <p data-testid="filter-text" className="comments__filter-text">
              Filter by
            </p>
            <select
              value={filter}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setFilter(e.target.value)
              }
              className="comments__filter"
            >
              <option value="Default" disabled>
                Default
              </option>
              <option value="popular" className="comments__filter-option">
                Most popular
              </option>
              <option value="latest" className="comments__filter-option">
                Latest
              </option>
            </select>
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
            .map(({ _id, text, user_id, likes, date }) => {
              return (
                <Comment
                  key={_id}
                  _id={_id}
                  text={text}
                  user_id={user_id}
                  likes={likes}
                  date={date}
                  refreshComments={getAllComments}
                />
              );
            })}
          {comments?.length === 0 && (
            <p className="comments__info">No comments yet</p>
          )}
        </div>
      </div>

      <div className="comments__container-input">
        <div style={{ display: 'flex' }}>
          <div style={{ width: '100%', position: 'relative' }}>
            <input
              data-testid="input-comments"
              className="comments__input"
              value={commentText}
              onChange={(e: any) => {
                setCommentText(e.target.value);
              }}
              onKeyDown={(e: any) => {
                if (e.code === 'Space' && commentText.length === 1) {
                  setCommentText('');
                }
              }}
              type="text"
            />

            <button
              className="comments__emoji"
              onClick={() => setOpenEmojiList(prevState => !prevState)}
            >
              <i className="fas fa-smile"></i>
            </button>
          </div>
          <button
            data-testid="publish"
            className="comments__publish"
            onClick={handleNewComment}
          >
            Publish
          </button>
        </div>

        {openEmojiList && (
          <Picker
            pickerStyle={{
              width: '100%',
              background: 'var(--light-bg-400)',
              boxShadow: 'none',
              border: '1px solid var(--font-dark-600)',
              marginTop: '1rem',
            }}
            disableSearchBar={true}
            onEmojiClick={onEmojiClick}
          />
        )}
        <p data-testid="message" className="comments__message">
          {message}
        </p>
      </div>

      {popup && <BlurredMenu setUserOption={setPopup} />}
    </m.section>
  );
};

export default Comments;
