import axios from 'axios';
import { FC, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';
import Comment from './Comment';
import { motion as m, AnimatePresence as Presence } from 'framer-motion';
import {
  CommentsData,
  CommentProps,
} from '../../interfaces/comments/commentsInterfaces';
import { useCounter } from '../../store/sub';
import { BlurredMenu } from '../Animations/Popup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import CustomTextarea from '../FormFields/CustomTextarea';
import { commentsOptions } from '../../helpers/filterOptions';
import Select from 'react-select';
import { CustomSelect } from '../../helpers/selectStyles.styled';
import { commentVariant } from '../../helpers/variants';
import { CookieUser } from '../../interfaces/auth/authInterface';

interface SortedElement {
  date: string;
  likes: string[];
  postId: string;
  text: string;
  userId: string;
  _id: string;
}

const Comments: FC<CommentProps> = ({
  postId,
  setOpenComments,
  authorId: postAuthorId,

  view = false,
}) => {
  const [commentText, setCommentText] = useState<string>('');
  const [comments, setComments] = useState<CommentsData[]>();
  const [filter, setFilter] = useState<string | undefined>('default');
  const [popup, setPopup] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const commentRef = useRef<any>();
  const [, actions] = useCounter();
  const [cookies] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;

  const commentId = window.location.href.split('#')[1];

  const MODE_POPULAR = 'popular';
  const MODE_LATEST = 'latest';
  const MODE_DEFAULT = 'default';

  const handleNewComment = (): void => {
    if (!user) return setPopup(true);
    setLoading(true);
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

        setTimeout(() => {
          commentRef.current.scrollTo({
            top: commentRef.current.scrollHeight,
            behavior: 'smooth',
          });
          setLoading(false);
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
          <div style={{ width: '40%' }}>
            {comments?.length! > 0 && (
              <div className="comments__filter">
                <CustomSelect
                  options={commentsOptions}
                  defaultValue={commentsOptions[0]}
                  onChange={(value: any) => setFilter(value?.value)} //WARNING Typec check value or leave it as any. Styling with styled components return typof ReactSelect without any types
                  classNamePrefix="react-select"
                />
              </div>
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
          name="comment"
          textValue={commentText}
          setTextValue={setCommentText}
          handleAction={handleNewComment}
          img={user.avatar}
          placeholder={`Add comment as ${user.firstName} ${user.lastName}`}
          loading={loading}
        />
      )}
      <Presence initial={false} exitBeforeEnter>
        {popup && <BlurredMenu stateHandler={setPopup} />}
      </Presence>
    </m.section>
  );
};

export default Comments;
