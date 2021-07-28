import axios from 'axios';
import React, { FC, useState } from 'react';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { LikedElements } from '../../../hooks/LikedElements';
import { AuthorInterface } from '../../../interfaces/common/common';

interface SingleCommentProps {
  _id: string;
  user_id: string;
  text: string;
  likes: string[];
  refreshComments: () => void;
}

const Comment: FC<SingleCommentProps> = ({
  _id,
  user_id,
  text,
  likes,
  refreshComments,
}) => {
  const [cookies] = useCookies();
  const { user } = cookies;
  const [liked, setLiked] = useState<boolean | undefined>();
  const [author, setAuthor] = useState<AuthorInterface>();

  const authorOfComment = () => {
    axios
      .get(`${process.env.REACT_APP_API}/author?userId=${user_id}`)
      .then(res => setAuthor(res.data));
  };

  const handleLikeComment = () => {
    axios
      .post(`${process.env.REACT_APP_API}/comments/like`, {
        _id,
        userId: user._id,
      })
      .then(() => refreshComments());
  };

  useEffect(() => {
    authorOfComment();
    const like = LikedElements(user, likes);
    setLiked(like);
  }, [likes]);

  return (
    <div className="comment">
      <div className="comment__author">
        <img
          className="comment__author-image"
          src={author?.avatar}
          alt="user profile"
        />
        <p>
          {author?.firstName} {author?.lastName}
        </p>
      </div>
      <p className="comment__content">{text}</p>
      <div className="comment__action">
        <p>{likes.length}</p>
        <button
          className="comment__btn"
          style={liked ? { color: 'purple' } : { color: '#555' }}
          onClick={() => {
            if (user) {
              handleLikeComment();
            }
          }}
        >
          <i className="fas fa-star" />
        </button>
      </div>
    </div>
  );
};

export default Comment;
