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
    <div style={{ marginTop: '10px', background: '#d9d9d9', color: '#000' }}>
      <p>
        {author?.firstName} {author?.lastName}
      </p>
      <p>{text}</p>
      <img
        style={{ width: '50px', height: '50px', borderRadius: '100%' }}
        src={author?.avatar}
        alt="user profile"
      />
      <p>Likes: {likes.length}</p>
      <button
        style={liked ? { background: 'green' } : { background: 'gray' }}
        onClick={() => {
          if (user) {
            handleLikeComment();
          }
        }}
      >
        add like
      </button>
    </div>
  );
};

export default Comment;
