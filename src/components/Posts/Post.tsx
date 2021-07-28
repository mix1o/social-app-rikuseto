import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Comments from '../Comments/Comments';
import { LikedElements } from '../../hooks/LikedElements';
import moment from 'moment';
import { PostInterfaceExtended } from '../../interfaces/posts/postInterfaces';
import { AuthorInterface } from '../../interfaces/common/common';

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

  useEffect(() => {
    authorOfPost();
    const like = LikedElements(user, likes);
    setLiked(like);
    return;
  }, [likes, user]);

  return (
    <div data-testid="post" className="post">
      {file.length > 3 && (
        <div className="post__image-container">
          <img className="post__image" src={file} alt={headline} />
        </div>
      )}
      <div className="post__author">
        <img className="post__image-author" src={author?.avatar} />
        <p>
          {author?.firstName} {author?.lastName}
        </p>
      </div>
      <div className="post__content">
        <div className="post__type">
          <p className="post__date">{moment(date).fromNow()}</p>
          <p className="post__category">Category: {category}</p>
        </div>
        <p className="post__headline">{headline}</p>
      </div>
      <div className="post__actions">
        <div className="post__container-likes">
          <p className="post__likes">{likes.length}</p>
          <button
            className="post__btn post__star"
            style={liked ? { color: 'purple' } : { color: '#555' }}
            onClick={() => {
              if (user) {
                handleLikePost(_id, user._id);
              }
            }}
          >
            <i className="fas fa-star"></i>
          </button>
        </div>
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
    </div>
  );
};

export default Post;
