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
import BlurredMenu from '../Navigation/BlurredMenu';
import { faStar as faStarChonky } from '@fortawesome/free-solid-svg-icons/faStar';
import { faStar as farBellThin } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Floater from 'react-floater';
import {
  EmailShareButton,
  FacebookShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  RedditIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share';
import { useLocation } from 'react-router-dom';

const Post: FC<PostInterfaceExtended> = ({
  _id,
  user_id,
  headline,
  category,
  file,
  likes,
  refreshPosts,
  date,
  saved,
}) => {
  const [cookies] = useCookies();
  const { user } = cookies;
  const [liked, setLiked] = useState<boolean | undefined>(false);
  const [openComments, setOpenComments] = useState<boolean>(false);
  const [popup, setPopup] = useState<boolean>(false);

  const [author, setAuthor] = useState<AuthorInterface>();
  const [commentAuthor, setCommentAuthor] = useState<AuthorInterface>();
  const [comment, setComment] = useState<TopComment>();

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
          authorOfComment(res.data.topComment.user_id).then(res => {
            setCommentAuthor(res);
          });
        }
      });
  };

  useEffect(() => {
    fetchTopComment();
  }, []);

  useEffect(() => {
    authorOfComment(user_id).then(res => setAuthor(res));

    const like = LikedElements(user, likes);
    setLiked(like);
    return;
  }, [likes, user]);

  const linkShare = `https://social-rikuseto.netlify.app/post/${_id}`;

  const [disableComments, setDisableComments] = useState<boolean>(false);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.includes('/post')) {
      setDisableComments(true);
    }
  }, [location.pathname]);

  const ShareSocials = () => {
    return (
      <>
        <div className="post__container-socials">
          <FacebookShareButton url={linkShare}>
            <FacebookIcon size={40} round={true} />
          </FacebookShareButton>
          <RedditShareButton url={linkShare}>
            <RedditIcon size={40} round={true} />
          </RedditShareButton>
          <WhatsappShareButton url={linkShare}>
            <WhatsappIcon size={40} round={true} />
          </WhatsappShareButton>
          <TelegramShareButton url={linkShare}>
            <TelegramIcon size={40} round={true} />
          </TelegramShareButton>
          <TwitterShareButton url={linkShare}>
            <TwitterIcon size={40} round={true} />
          </TwitterShareButton>
          <EmailShareButton url={linkShare}>
            <EmailIcon size={40} round={true} />
          </EmailShareButton>
        </div>
        <p className="post__share-info">Or just copy link</p>
        <div className="post__container-link">
          <a href={linkShare} className="post__link">
            {linkShare}
          </a>
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText(linkShare);
          }}
          className="post__btn-copy"
        >
          Copy link
          <i className="far fa-copy"></i>
        </button>
      </>
    );
  };

  const deletePost = () => {
    axios.delete(`${process.env.REACT_APP_API}/posts/delete`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        postId: _id,
      },
    });
    window.location.reload();
  };

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [newHeadline, setNewHeadline] = useState<string>(headline);
  const [message, setMessage] = useState<string>('');

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

  const savePost = () => {
    axios.put(`${process.env.REACT_APP_API}/posts/save`, {
      _id,
      userId: user._id,
    });
  };

  const ActionsPost = () => {
    return (
      <div className="post__container-dots-actions">
        {user && user._id !== user_id && (
          <>
            <button
              onClick={async () => {
                savePost();
                if (saved) {
                  setTimeout(() => {
                    refreshPosts();
                  }, 200);
                }
              }}
              className="post__action"
            >
              {!saved ? 'Save post' : 'Unsave'}
              <i style={{ marginLeft: '.5rem' }} className="fas fa-flag"></i>
            </button>
            <button className="post__action">
              Report
              <i style={{ marginLeft: '.5rem' }} className="fas fa-ban"></i>
            </button>
          </>
        )}
        {user && user._id === user_id ? (
          <>
            <button onClick={() => setIsEdit(true)} className="post__action">
              Edit
              <i style={{ marginLeft: '.5rem' }} className="fas fa-edit"></i>
            </button>
            <button
              onClick={deletePost}
              className="post__action post__action--delete"
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

  const [openToolTip, setOpenToolTip] = useState<boolean>(false);

  return (
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
            content={ActionsPost()}
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
      <div className="post__author">
        <img
          className="post__image-author"
          src={author?.avatar}
          alt="user profile"
        />
        <div>
          <p className="post__author-name">
            {author?.firstName} {author?.lastName}
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
          animate={liked ? { color: '#753ee0' } : { color: 'inherit' }}
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
                {comment?.allComments}
              </span>
              comments
            </button>
          )}
          <button className="post__btn post__single-action">
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
              content={ShareSocials()}
            >
              <div style={{ display: 'flex' }}>
                Share <i className="fas fa-share"></i>
              </div>
            </Floater>
          </button>
        </div>
      </div>
      {!disableComments && comment?.topComment && (
        <>
          <p className="post__top-comment">
            <span className="post__top-author">{commentAuthor?.firstName}</span>
            {' · '}
            <span className="post__top-date">
              {dayjs(comment.topComment.date).fromNow()}
            </span>{' '}
            {' · '}
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
            <p className="post__comments-text">Be this first one to comment</p>
          )}
        </div>
      )}
      <Presence exitBeforeEnter>
        {openComments && (
          <Comments
            key={_id}
            postId={_id}
            setOpenComments={setOpenComments}
            fetchTopComment={fetchTopComment}
          />
        )}
      </Presence>
      {popup && <BlurredMenu setUserOption={setPopup} />}
    </section>
  );
};

export default Post;
