import axios from 'axios';
import React, { ChangeEvent, FC, useState } from 'react';
import styled from 'styled-components';
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';
import Comment from './Comment/Comment';
import { motion as m } from 'framer-motion';
import {
  CommentsData,
  CommentProps,
} from '../../interfaces/comments/commentsInterfaces';
import { useCounter } from '../../store/sub';

const commentVariant = {
  hidden: {
    y: 1000,
    opacity: 0,
    transition: {
      type: 'tween',
    },
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'tween',
    },
  },
};

const Comments: FC<CommentProps> = ({
  postId,
  setOpenComments,
  fetchTopComment,
}) => {
  const [commentText, setCommentText] = useState<string>('');
  const [comments, setComments] = useState<CommentsData[]>();
  const [cookies] = useCookies();
  const { user } = cookies;

  const handleNewComment = (): void => {
    if (commentText.length >= 1) {
      axios
        .post(`${process.env.REACT_APP_API}/comments/create`, {
          commentText,
          postId,
          userId: user._id,
        })
        .then(() => {
          setCommentText('');
          getAllComments();
          fetchTopComment();
        });
      return;
    }
    console.log('Too short text');
  };

  const getAllComments = (): void => {
    axios
      .get(`${process.env.REACT_APP_API}/comments?postId=${postId}`)
      .then(res => setComments(res.data));
  };

  useEffect(() => {
    getAllComments();
  }, []);

  const [state, actions] = useCounter();

  actions.isOpenComment(true);

  return (
    <m.section
      variants={commentVariant}
      initial="hidden"
      animate="show"
      exit="hidden"
      className="comments"
    >
      {!user && <p>You need to be logged in to add new comment</p>}
      <div>
        <button
          style={{ fontSize: '50px', color: 'white' }}
          onClick={() => {
            setOpenComments(false);
            actions.isOpenComment(false);
          }}
        >
          X
        </button>
        {comments?.map(({ _id, text, user_id, likes }) => {
          return (
            <Comment
              key={_id}
              _id={_id}
              text={text}
              user_id={user_id}
              likes={likes}
              refreshComments={getAllComments}
            />
          );
        })}
      </div>
      {user && (
        <div className="comments__">
          <input
            className="comments__input"
            value={commentText}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCommentText(e.target.value)
            }
            type="text"
          />
          <button onClick={handleNewComment}>Add comments</button>
        </div>
      )}
    </m.section>
  );
};

export default Comments;
