import axios from 'axios';
import React, { ChangeEvent, FC, useState } from 'react';
import styled from 'styled-components';
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';
import Comment from './Comment/Comment';
import {
  CommentsData,
  CommentProps,
} from '../../interfaces/comments/commentsInterfaces';

const ContainerComments = styled.div`
  background: #fff;
  min-height: 100vh;
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
`;

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

  return (
    <ContainerComments>
      <div onClick={() => setOpenComments(false)}>x</div>
      {user && (
        <>
          {' '}
          <input
            value={commentText}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCommentText(e.target.value)
            }
            type="text"
          />
          <button onClick={handleNewComment}>Add comments</button>
        </>
      )}
      {!user && <p>You need to be logged in to add new comment</p>}
      <div
        style={{
          maxHeight: '100vh',
          overflowY: 'scroll',
          paddingBottom: '4rem',
        }}
      >
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
    </ContainerComments>
  );
};

export default Comments;
