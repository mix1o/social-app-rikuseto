import axios from 'axios';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Comments from '../Comments/Comments';
import { LikedElements } from '../../hooks/LikedElements';
import { PostInterfaceExtended } from '../../interfaces/posts/postInterfaces';
import { AuthorInterface } from '../../interfaces/common/common';
import { motion as m, AnimatePresence as Presence } from 'framer-motion';
import { TopComment } from '../../interfaces/comments/commentsInterfaces';
import { authorOfComment } from '../../helpers/AuthorOfComment';
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
import ShareButton from './SharedPost/ShareButton';
import PostActions from './PostActions';

const Post: FC<PostInterfaceExtended> = ({
  _id,
  userId,
  headline,
  category,
  file,
  likes,
  refreshPosts,
  date,
}) => {
  const [liked, setLiked] = useState<boolean | undefined>(false);
  const [openComments, setOpenComments] = useState<boolean>(false);
  const [popup, setPopup] = useState<boolean>(false);
  const [openToolTip, setOpenToolTip] = useState<boolean>(false);
  const [disableComments, setDisableComments] = useState<boolean>(false);
  const [author, setAuthor] = useState<AuthorInterface>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [newHeadline, setNewHeadline] = useState<string>(headline);
  const [message, setMessage] = useState<string>('');
  const [showFloater, setShowFloater] = useState(false);

  const [commentAuthor, setCommentAuthor] = useState<AuthorInterface>();
  const [comment, setComment] = useState<TopComment>();

  const [cookies] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;

  const location = useLocation();
  const [state] = useCounter();
  const linkShare = `https://social-rikuseto.netlify.app/post/${_id}`;
  dayjs.extend(relativeTime);

  const handleLikePost = () => {
    if (user) {
      axios
        .post(`${process.env.REACT_APP_API}/posts/like`, {
          postId: _id,
          userId: user._id,
        })
        .then(() => {
          refreshPosts();
        })
        .catch(err => console.log(err));

      return;
    }
    setPopup(true);
  };

  const fetchTopComment = () => {
    axios
      .get(`${process.env.REACT_APP_API}/comments/top?postId=${_id}`)
      .then(res => {
        setComment(res.data);

        if (res.data.topComment) {
          authorOfComment(res.data.topComment.userId).then(res => {
            setCommentAuthor(res);
          });
        }
      });
  };

  useEffect(() => {
    fetchTopComment();
  }, []);

  useEffect(() => {
    authorOfComment(userId).then(res => {
      setAuthor(res);
    });

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
        refreshPosts();
      });
  };

  return (
    <>
      {headline &&
      author?.firstName &&
      author?.lastName &&
      comment &&
      category &&
      author?.avatar ? (
        <section
          data-testid="post"
          className={`post ${disableComments ? 'post__mBottom' : ''}`}
        >
          {user && (
            <div
              onClick={() => setOpenToolTip(prevState => !prevState)}
              className="post__container-dots"
            >
              <Floater
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
                  <PostActions
                    setIsEdit={setIsEdit}
                    id={_id}
                    userId={userId}
                    refreshPosts={refreshPosts}
                  />
                }
              >
                <button className="post__container-dots-btn">
                  <i className="fas fa-ellipsis-v"></i>
                </button>
              </Floater>
            </div>
          )}
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
                  {author?.firstName} {author?.lastName}
                </Link>
              </p>

              <p className="post__info">
                Posted on:{' '}
                <span className="post__category-name">{category}</span>
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
                onClick={() => handleLikePost()}
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
                <Floater
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
                </Floater>
              </button>
            </div>
          </div>
          {!disableComments && comment?.topComment && (
            <>
              <p className="post__top-comment">
                <span className="post__top-author">
                  {commentAuthor?.firstName}
                </span>

                <span className="post__top-date">
                  {dayjs(comment.topComment.date).fromNow()}
                </span>

                <span className="post__top-text">
                  {comment.topComment.text}
                </span>
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
                fetchTopComment={fetchTopComment}
              />
            )}
          </Presence>
          <Presence initial={false} exitBeforeEnter>
            {popup && <BlurredMenu stateHandler={setPopup} />}
          </Presence>
        </section>
      ) : (
        <div className="post">
          <div className="post__author">
            <div className="post__image-author">
              <SkeletonTheme
                color="var(--light-bg-700)"
                highlightColor="var(--light-bg-600)"
              >
                <Skeleton
                  style={{
                    borderRadius: '100%',
                    height: '35px',
                    width: '35px',
                  }}
                />
              </SkeletonTheme>
            </div>
            <div>
              <div className="post__author-name">
                <SkeletonTheme
                  color="var(--light-bg-700)"
                  highlightColor="var(--light-bg-600)"
                >
                  <Skeleton width={200} height={10} />
                </SkeletonTheme>
              </div>
              <div className="post__info">
                <SkeletonTheme
                  color="var(--light-bg-700)"
                  highlightColor="var(--light-bg-600)"
                >
                  <Skeleton width={150} height={8} />
                </SkeletonTheme>
              </div>
            </div>
          </div>
          <div className="post__content" style={{ margin: '2rem 4.5rem' }}>
            <SkeletonTheme
              color="var(--light-bg-700)"
              highlightColor="var(--light-bg-600)"
            >
              <Skeleton
                width={300}
                count={2}
                height={10}
                style={{ marginBottom: '5px' }}
              />
              <Skeleton height={10} width={250} />
            </SkeletonTheme>
          </div>
          <div
            className="post__actions"
            style={{
              padding: '0',
              justifyContent: 'center',
            }}
          >
            <SkeletonTheme
              color="var(--light-bg-700)"
              highlightColor="var(--light-bg-600)"
            >
              <Skeleton
                height={10}
                width={120}
                count={2}
                style={{
                  margin: '0rem 1rem 1rem 1rem',
                }}
              />
            </SkeletonTheme>
          </div>
        </div>
      )}
    </>
  );
};

export default Post;
