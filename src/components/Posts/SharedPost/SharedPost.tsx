import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PostInterface } from '../../../interfaces/posts/postInterfaces';
import Post from '../Post';
import { CommentsData } from '../../../interfaces/comments/commentsInterfaces';
import Comment from '../../Comments/Comment/Comment';
import Picker from 'emoji-picker-react';
import { useCookies } from 'react-cookie';
import Header from '../../Header/Header';

const SharedPost = () => {
  const { id } = useParams<{ id: string }>();

  const [post, setPost] = useState<PostInterface[]>();
  const [correct, setCorrect] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<CommentsData[]>();

  const fetchPost = (): void => {
    axios.get(`${process.env.REACT_APP_API}/posts/post?id=${id}`).then(res => {
      if (res.data.valid === false) {
        setCorrect(false);
        setLoading(false);
        return;
      }
      setPost(res.data);
      setCorrect(true);
      setLoading(false);
      fetchComments();
    });
  };
  const fetchComments = () => {
    axios
      .get(`${process.env.REACT_APP_API}/comments?postId=${id}`)
      .then(res => setComments(res.data));
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const [commentText, setCommentText] = useState<string>('');
  const [openEmojiList, setOpenEmojiList] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const onEmojiClick = (event: any, emojiObject: any) => {
    setCommentText(prevState => prevState + emojiObject.emoji);
    console.log(emojiObject);
  };

  const [cookies] = useCookies();
  const { user } = cookies;

  const handleNewComment = (): void => {
    if (
      commentText.length >= 2 ||
      (commentText.length >= 1 &&
        (/\d/.test(commentText) ||
          /[a-zA-Z]/g.test(commentText) ||
          /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(commentText)))
    ) {
      axios
        .post(`${process.env.REACT_APP_API}/comments/create`, {
          commentText,
          postId: id,
          userId: user._id,
        })
        .then(() => {
          setCommentText('');
          fetchComments();
          setOpenEmojiList(false);
        });
      return;
    }
    setMessage('Text must be at least 1 character');
  };

  return (
    <>
      <Header />
      <div className="post__container-shared">
        {correct &&
          !loading &&
          post?.map(
            ({ _id, user_id, headline, category, file, likes, date }) => (
              <Post
                key={_id}
                _id={_id}
                user_id={user_id}
                headline={headline}
                category={category}
                file={file}
                likes={likes}
                date={date}
                onClickLike={fetchPost}
              />
            )
          )}
        {correct && (
          <>
            <p className="post__shared-text">Comments: </p>
            <div className="post__shared-comments">
              {comments?.map(({ _id, text, user_id, likes, date }) => (
                <Comment
                  key={_id}
                  _id={_id}
                  text={text}
                  user_id={user_id}
                  likes={likes}
                  date={date}
                  refreshComments={fetchComments}
                />
              ))}
            </div>
          </>
        )}
        {correct && (
          <div
            style={{ position: 'relative', marginBottom: '5rem' }}
            className="comments__container-input"
          >
            <div style={{ display: 'flex' }}>
              <input
                data-testid="input-comments"
                className="comments__input"
                value={commentText}
                onChange={(e: any) => {
                  setCommentText(e.target.value);
                }}
                onKeyDown={(e: any) => {
                  if (e.code === 'Space' && commentText.length === 1) {
                    setCommentText('');
                  }
                }}
                type="text"
              />

              <button
                data-testid="publish"
                className="comments__publish"
                onClick={handleNewComment}
              >
                Publish
              </button>
            </div>
            <button onClick={() => setOpenEmojiList(prevState => !prevState)}>
              <i className="fas fa-smile"></i>
            </button>
            {openEmojiList && <Picker onEmojiClick={onEmojiClick} />}
            <p data-testid="message" className="comments__message">
              {message}
            </p>
          </div>
        )}
        {!correct && !loading && (
          <>
            <p className="post__shared-error">Content not found</p>
            <div className="post__shared-container-links">
              <Link className="post__shared-link" to="/">
                Back to explore
              </Link>
              <Link className="post__shared-link" to="/">
                Report a bug
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SharedPost;
