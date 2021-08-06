import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Comments from '../Comments/Comments';
import { LikedElements } from '../../hooks/LikedElements';
import moment from 'moment';
import { PostInterfaceExtended } from '../../interfaces/posts/postInterfaces';
import { AuthorInterface } from '../../interfaces/common/common';
import { motion as m, AnimatePresence as Presence } from 'framer-motion';
import { TopComment } from '../../interfaces/comments/commentsInterfaces';
import { authorOfComment } from '../../helpers/AuthorOfComment';
import BlurredMenu from '../Navigation/BlurredMenu';
import { faStar as faStarChonky } from '@fortawesome/free-solid-svg-icons/faStar';
import { faStar as farBellThin } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  onClickLike,
  date,
}) => {
  const [cookies] = useCookies();
  const { user } = cookies;
  const [liked, setLiked] = useState<boolean | undefined>(false);
  const [openComments, setOpenComments] = useState<boolean>(false);
  const [popup, setPopup] = useState<boolean>(false);

  const [author, setAuthor] = useState<AuthorInterface>();
  const [commentAuthor, setCommentAuthor] = useState<AuthorInterface>();
  const [comment, setComment] = useState<TopComment>();

  const handleLikePost = () => {
    if (user) {
      axios
        .post(`${process.env.REACT_APP_API}/posts/like`, {
          postId: _id,
          userId: user._id,
        })
        .then(() => {
          onClickLike();
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

  const linkShare = `https://social-rikueto.netlify.app/post/${_id}`;

  const [disableComments, setDisableComments] = useState<boolean>(false);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.includes('/post')) {
      setDisableComments(true);
    }
  }, [location.pathname]);

  const ShareIitems = () => {
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

  return (
    <section data-testid="post" className="post">
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
            <span> {moment(date).fromNow()}</span>
          </p>
        </div>
      </div>
      <div className="post__content">
        <h3 className="post__headline">{headline}</h3>
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
              content={ShareIitems()}
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
              {moment(comment.topComment.date).fromNow()}
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
