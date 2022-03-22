import { useState, useEffect, memo, useRef, SyntheticEvent } from 'react';
import { useCookies } from 'react-cookie';
import Category from './Category';
import CropImage from './CropImage';
import { ActionEnum } from '../../interfaces/posts/postInterfaces';
import useNotification from '../../hooks/useNotification';
import { CookieUser } from '../../interfaces/auth/authInterface';
import { useCreatePostCtx } from '../../hooks/useCreatePost';
import axios from 'axios';
// import { useCreatePost } from '../../hooks/usePost';

const CreatePost = () => {
  const [cookies] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;
  const { dispatch, state } = useCreatePostCtx();

  const [correctImage, setCorrectImage] = useState<boolean>(false);
  const [userPickedImage, setUserPickedImage] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [correctFormatPost, setCorrectFormatPost] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(false);
  // const createPostMutation = useCreatePost();
  const {
    checkNotificationSupport,
    checkUserPermission,
    subscribeToPushNotification,
  } = useNotification();
  const ref = useRef<HTMLElement>(null);

  const createNewPost = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      // createPostMutation.mutateAsync(state);

      axios.post(`${process.env.REACT_APP_API}/posts/create`, state);
    }
  };

  const checkCorrectPost = () => {
    if (userPickedImage) {
      if (
        state.headline.trim().length >= 3 &&
        state.category &&
        state.file.length > 3 &&
        correctImage
      ) {
        setDisable(false);
        setMessage('');
        return true;
      } else {
        setMessage('Choose your image');
        return false;
      }
    }

    if (state.headline.length >= 3 && state.category.length > 0) {
      return true;
    } else {
      setMessage(
        'Headline must be at least 3 words and category cannot be empty'
      );
      return false;
    }
  };

  useEffect(() => {
    setCorrectFormatPost(checkCorrectPost());

    return () => setCorrectFormatPost(false);
  }, [state, correctImage, userPickedImage]);

  useEffect(() => {
    if (ref.current) {
      const currentHeight = ref.current.scrollHeight;

      if (Math.floor((100 * currentHeight) / window.innerHeight) >= 70) {
        ref.current.style.overflowY = 'scroll';
      }
    }
  }, [ref.current?.scrollHeight]);

  const handleNotification = () => checkUserPermission();

  return (
    <section ref={ref} className="create-post">
      <h2 data-testid="create-post__header">Create new post</h2>
      <label className="create-post__label">
        <input
          data-testid="headline"
          value={state.headline}
          onChange={e =>
            dispatch({
              type: ActionEnum.SET_HEADLINE,
              payload: e.target.value,
            })
          }
          type="text"
          name={ActionEnum.SET_HEADLINE}
          placeholder="Write something interesting"
          className="create-post__title"
        />
      </label>

      <Category />
      <CropImage
        setMessage={setMessage}
        setUserPickedImage={setUserPickedImage}
        setCorrectImage={setCorrectImage}
        correctImage={correctImage}
      />
      {disable && <p>Loading image...</p>}
      {!correctFormatPost && state!.headline!.length > 0 && (
        <p data-testid="message" className="create-post__message">
          {message}
        </p>
      )}
      {checkNotificationSupport && (
        <label
          onClick={handleNotification}
          className="create-post__notification-label"
        >
          <input
            type="checkbox"
            onChange={() => dispatch({ type: ActionEnum.SET_NOTIFICATION })}
            className="create-post__notifications"
            name={ActionEnum.SET_NOTIFICATION}
          />
          <p className="create-post__notifications-text">
            Receive notification{' '}
            <span>{`${
              !checkUserPermission() ? '(Notifications are disabled)' : ''
            }`}</span>
          </p>
        </label>
      )}
      {checkNotificationSupport && (
        <button onClick={subscribeToPushNotification}>subscript</button>
      )}

      <button
        className="create-post__btn-add"
        data-testid="button"
        // disabled={!correctFormatPost || createPostMutation.status === 'loading'}
        onClick={createNewPost}
      >
        Create post
      </button>
    </section>
  );
};

export default memo(CreatePost);

// TODO Pagination posts,comments, messages
