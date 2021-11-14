import axios from 'axios';
import {
  ChangeEvent,
  FC,
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useCookies } from 'react-cookie';
import Comments from '../Comments/Comments';
import { LikedElements } from '../../helpers/likedElements';
import { PostInterfaceExtended } from '../../interfaces/posts/postInterfaces';
import { AuthorInterface } from '../../interfaces/common/common';
import { motion as m, AnimatePresence as Presence } from 'framer-motion';
import { TopComment } from '../../interfaces/comments/commentsInterfaces';
import { authorOfComment } from '../../helpers/authorOfComment';
import { BlurredMenu } from '../Animations/Popup';
import { faStar as faStarChonky } from '@fortawesome/free-solid-svg-icons/faStar';
import { faStar as farBellThin } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Floater from 'react-floater';
import { useLocation, Link } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useCounter } from '../../store/sub';
import { CookieUser } from '../../interfaces/auth/authInterface';
import ShareButton from './ShareButton';
import PostActions from './PostActions';
import { useLikePost } from '../../hooks/usePost';
import { useCommentAuthor, useTopComment } from '../../hooks/useComment';
import CustomFloater from './Floater';
import { usePopper } from 'react-popper';

const Post: FC<PostInterfaceExtended> = ({
  _id,
  userId,
  headline,
  category,
  file,
  likes,
  date,
}) => {
  const [liked, setLiked] = useState<boolean | undefined>(false);
  const [openComments, setOpenComments] = useState<boolean>(false);
  const [popup, setPopup] = useState<boolean>(false);
  const [openToolTip, setOpenToolTip] = useState<boolean>(false);
  const [disableComments, setDisableComments] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [newHeadline, setNewHeadline] = useState<string>(headline);
  const [message, setMessage] = useState<string>('');
  const [showFloater, setShowFloater] = useState(false);

  const [cookies] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;

  const likePost = useLikePost();
  const { data: comment, status } = useTopComment(_id);
  const { data: commentAuthor, refetch } = useCommentAuthor(
    comment?.topComment?.userId
  );
  const { data: author, refetch: refetchAuthor } = useCommentAuthor(userId);

  const location = useLocation();
  const [state] = useCounter();
  const linkShare = `https://social-rikuseto.netlify.app/post/${_id}`;
  dayjs.extend(relativeTime);

  const handleLikePost = () => {
    if (user) {
      return likePost.mutate(_id);
    }

    setPopup(true);
  };

  useEffect(() => {
    if (status === 'success' && comment?.topComment && !commentAuthor) {
      refetch();
    }
  }, [status]);

  useEffect(() => {
    if (!author) {
      refetchAuthor();
    }

    const like = LikedElements(user, likes);
    setLiked(like);

    return;
  }, [likes, user?._id]);

  useEffect(() => {
    if (location.pathname.includes('/post')) {
      setDisableComments(true);
    }
  }, [location.pathname]);

  const editPost = () => {
    if (newHeadline === headline) {
      setMessage('First you need to edit your post');
      return;
    }
    axios
      .patch(`${process.env.REACT_APP_API}/posts/edit`, {
        _id,
        newHeadline,
      })
      .then(() => {
        setIsEdit(false);
        //TODO query refresh
      });
  };
  // let refReference: HTMLButtonElement;
  // let popperElem: HTMLDivElement;

  // const [referenceElement, setReferenceElement] =
  //   useState<HTMLButtonElement | null>(null);
  // const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
  //   null
  // );
  // const { styles, attributes, update } = usePopper(
  //   referenceElement,
  //   popperElement,
  //   {
  //     placement: 'auto',
  //     strategy: 'fixed',
  //     onFirstUpdate: state =>
  //       console.log('Popper positioned on', state.placement),
  //     modifiers: [
  //       {
  //         name: 'flip',
  //         options: {
  //           fallbackPlacements: ['top', 'right'],
  //         },
  //       },
  //     ],
  //   }
  // );
  // TODO Change ract floater, couse of remap lags
  return (
    <>
      <section
        data-testid="post"
        className={`post ${disableComments ? 'post__mBottom' : ''}`}
      >
        {user && (
          <div
            onClick={() => setOpenToolTip(prevState => !prevState)}
            onBlur={() => setOpenToolTip(prevState => !prevState)}
            className="post__container-dots"
          >
            {/* <Floater
              open={openToolTip}
              offset={0}
              placement="auto"
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
                  margin: 0,
                },
                arrow: {
                  color: 'var(--light-bg-700)',
                  length: 8,
                  spread: 10,
                },
              }}
              content={
              }
            > */}
            {/* <PostActions setIsEdit={setIsEdit} id={_id} userId={userId} /> */}
            {/* <>
              <button
                ref={node => setReferenceElement(node)}
                className="post__container-dots-btn"
              >
                <i className="fas fa-ellipsis-v"></i>
              </button>
            </> */}
          </div>
        )}
        {/* {openToolTip && (
          <div ref={node => setPopperElement(node)} {...attributes.popper}>
            <PostActions setIsEdit={setIsEdit} id={_id} userId={userId} />
          </div>
        )} */}
        <div className="post__author">
          <img
            className="post__image-author"
            src={author?.avatar}
            alt="user profile"
          />

          <div>
            <p className="post__author-name">
              <Link
                className="post__author-link"
                to={
                  user && userId === user._id
                    ? '/account'
                    : `/profile/${userId}`
                }
              >
                {author?.status === 200 ? (
                  (author?.firstName, author?.lastName)
                ) : (
                  <em className="removed-author">(Deleted)</em>
                )}
              </Link>
            </p>

            <p className="post__info">
              Posted on: <span className="post__category-name">{category}</span>
              <span> {dayjs(date).fromNow()}</span>
            </p>
          </div>
        </div>
        <div className="post__content">
          {!isEdit && <h3 className="post__headline">{headline}</h3>}
          {isEdit && (
            <div className="post__edit-input-container">
              <input
                className="post__edit-input"
                value={newHeadline}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNewHeadline(e.target.value)
                }
                type="text"
              />
              <span className="post__edit-message">{message}</span>
              <div style={{ marginBottom: '1rem' }}>
                <button
                  onClick={editPost}
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
            </div>
          )}
        </div>
        {file.length > 3 && (
          <div className="post__image-container">
            <img className="post__image" src={file} alt={headline} />
          </div>
        )}
        <div
          style={disableComments ? { paddingBottom: '1rem' } : {}}
          className="post__actions"
        >
          <m.div
            className="post__container-likes"
            animate={{
              color: liked
                ? '#753ee0'
                : state.theme === 'dark'
                ? '#f8f8f8'
                : '#36344b',
            }}
          >
            <m.button
              className="post__btn"
              whileTap={{ scale: 1.2 }}
              onClick={handleLikePost}
              aria-label="like or dislike post"
              type="button"
            >
              {liked ? (
                <FontAwesomeIcon icon={faStarChonky} />
              ) : (
                <FontAwesomeIcon icon={farBellThin} />
              )}
            </m.button>
            <span className="post__likes">{likes.length}</span>
          </m.div>
          <div>
            {!disableComments && (
              <button
                className="post__btn post__single-action"
                onClick={() => setOpenComments(true)}
              >
                <span className="post__count-comments">
                  {comment?.allComments}{' '}
                </span>
                comments
              </button>
            )}
            <button
              onClick={() => setShowFloater(prevVal => !prevVal)}
              onBlur={() => setShowFloater(false)}
              className="post__btn post__single-action"
            >
              {/* <Floater
                styles={{
                  floater: {
                    filter: 'none',
                  },
                  container: {
                    backgroundColor: 'var(--light-bg-700)',
                    color: 'var(--font-dark-600)',
                    filter: 'none',
                    minHeight: 'none',
                    padding: 10,
                  },
                  arrow: {
                    color: 'var(--light-bg-700)',
                    length: 8,
                    spread: 10,
                  },
                }}
                content={ShareButton({ link: linkShare })}
                open={showFloater}
              >
                <div style={{ display: 'flex' }}>
                  share <i className="fas fa-share"></i>
                </div>
              </Floater> */}
            </button>
          </div>
        </div>
        {!disableComments && comment?.topComment && (
          <>
            <p className="post__top-comment">
              <span className="post__top-author">
                {commentAuthor?.status === 200 ? (
                  commentAuthor?.firstName
                ) : (
                  <em className="removed-author">(Deleted)</em>
                )}
              </span>

              <span className="post__top-date">
                {dayjs(comment.topComment.date).fromNow()}
              </span>

              <span className="post__top-text">{comment.topComment.text}</span>
            </p>
          </>
        )}
        {!disableComments && comment && (
          <div
            className="post__comments--count"
            onClick={() => setOpenComments(true)}
          >
            {comment.allComments >= 1 ? (
              <p className="post__comments-text">
                View all comments{' '}
                <span className="post__comments-total">
                  &#40;{comment?.allComments}&#41;
                </span>
              </p>
            ) : (
              <p className="post__comments-text">
                Be this first one to comment
              </p>
            )}
          </div>
        )}

        <Presence exitBeforeEnter>
          {openComments && (
            <Comments
              key={_id}
              postId={_id}
              authorId={userId}
              setOpenComments={setOpenComments}
            />
          )}
        </Presence>
        <Presence initial={false} exitBeforeEnter>
          {popup && <BlurredMenu stateHandler={setPopup} />}
        </Presence>
      </section>
    </>
  );
};

export default memo(Post);
