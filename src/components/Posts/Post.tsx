import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Comments from '../Comments/Comments';
import { LikedElements } from '../../hooks/LikedElements';
import moment from 'moment';
import { PostInterfaceExtended } from '../../interfaces/posts/postInterfaces';
import { AuthorInterface } from '../../interfaces/common/common';
import { motion as m } from 'framer-motion';

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

  const [author, setAuthor] = useState<AuthorInterface>();
  const [topPost, setTopPost] = useState({});

  const authorOfPost = () => {
    axios
      .get(`${process.env.REACT_APP_API}/author?userId=${user_id}`)
      .then(res => setAuthor(res.data));
  };

  const handleLikePost = (id: string, user_id: string) => {
    axios
      .post(`${process.env.REACT_APP_API}/posts/like`, {
        postId: id,
        userId: user_id,
      })
      .then(() => {
        onClickLike();
      })
      .catch(err => console.log(err));
  };

  const fetchComment = (postId: string) => {
    axios
      .get(`${process.env.REACT_APP_API}/comments/top?postId=${postId}`)
      .then(res => console.log(res.data));
  };

  useEffect(() => {
    authorOfPost();
    fetchComment(_id);

    const like = LikedElements(user, likes);
    setLiked(like);
    return;
  }, [likes, user]);

  return (
    <section data-testid="post" className="post">
      {file.length > 3 && (
        <div className="post__image-container">
          <img className="post__image" src={file} alt={headline} />
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
            <span> {moment(date).fromNow()}</span>
          </p>
        </div>
      </div>
      <div className="post__content">
        <h3 className="post__headline">{headline}</h3>
      </div>
      <div className="post__actions">
        <m.div
          className="post__container-likes"
          animate={liked ? { color: '#753ee0' } : { color: '#222831' }}
        >
          <m.button
            className="post__btn"
            whileTap={{ scale: 1.2 }}
            onClick={() => {
              if (user) {
                handleLikePost(_id, user._id);
              }
            }}
            aria-label="like or dislike post"
            type="button"
          >
            <i className="fas fa-star"></i>
          </m.button>
          <span className="post__likes">{likes.length}</span>
        </m.div>
        <button className="post__btn" onClick={() => setOpenComments(true)}>
          <i className="far fa-comment"></i>
        </button>
      </div>
      <div className="post__comments" onClick={() => setOpenComments(true)}>
        <p>View all comments</p>
      </div>
      {openComments && (
        <Comments postId={_id} setOpenComments={setOpenComments} />
      )}
    </section>
  );
};

export default Post;
