import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Comments from '../Comments/Comments';
import { LikedElements } from '../../hooks/LikedElements';
import moment from 'moment';
import { PostInterfaceExtended } from '../../interfaces/posts/postInterfaces';
import { AuthorInterface } from '../../interfaces/common/common';
import { motion as m } from 'framer-motion';
import { TopComment } from '../../interfaces/comments/commentsInterfaces';
import { authorOfComment } from '../../helpers/AuthorOfComment';
import BlurredMenu from '../Navigation/BlurredMenu';
import { faStar as faStarChonky } from '@fortawesome/free-solid-svg-icons/faStar';
import { faStar as farBellThin } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
          userId: user_id,
        })
        .then(() => {
          onClickLike();
        })
        .catch(err => console.log(err));

      return;
    }
    setPopup(true);
  };

  const fetchTopComment = (postId: string) => {
    axios
      .get(`${process.env.REACT_APP_API}/comments/top?postId=${postId}`)
      .then(res => setComment(res.data));
  };

  useEffect(() => {
    if (comment?.topComment) {
      authorOfComment(comment?.topComment.user_id).then(res => {
        setCommentAuthor(res);
      });
    }
    fetchTopComment(_id);
  }, [comment]);

  useEffect(() => {
    authorOfComment(user_id).then(res => setAuthor(res));

    const like = LikedElements(user, likes);
    setLiked(like);
    return;
  }, [likes, user]);

  const theme = localStorage.getItem('theme');

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
      <div className="post__actions">
        <m.div
          className="post__container-likes"
          animate={liked ? { color: '#753ee0' } : { color: '#000' }}
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
          <button
            className="post__btn post__single-action"
            onClick={() => setOpenComments(true)}
          >
            <span className="post__count-comments">{comment?.allComments}</span>
            comments
          </button>
          <button className="post__btn post__single-action">
            Share <i className="fas fa-share"></i>
          </button>
        </div>
      </div>
      {comment?.topComment && (
        <>
          <p className="post__top-comment">
            <p>Popular: </p>
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

      {comment && (
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
      {openComments && (
        <Comments postId={_id} setOpenComments={setOpenComments} />
      )}
      {popup && <BlurredMenu setUserOption={setPopup} />}
    </section>
  );
};

export default Post;
