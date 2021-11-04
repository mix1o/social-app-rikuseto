import { FC, useState, useEffect, memo, useRef } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Category from './Category';
import CropImage from './CropImage';
import { ActionEnum } from '../../interfaces/posts/postInterfaces';
import useNotification from '../../hooks/notifications/useNotification';
import { CookieUser } from '../../interfaces/auth/authInterface';
import { useCounter } from '../../store/sub';
import { useCreatePostCtx } from '../../hooks/useCreatePost';

interface CreateProps {
  handleFetchPosts: () => void;
}

const CreatePost: FC<CreateProps> = ({ handleFetchPosts }) => {
  const [cookies] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;
  const postCtx = useCreatePostCtx();
  const [, actions] = useCounter();
  console.log(postCtx.state);
  const [correctImage, setCorrectImage] = useState<boolean>(false);
  const [userPickedImage, setUserPickedImage] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [correctFormatPost, setCorrectFormatPost] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(false);
  const {
    checkNotificationSupport,
    checkUserPermission,
    subscribeToPushNotification,
  } = useNotification();
  const ref = useRef<HTMLElement>(null);

  const createNewPost = async () => {
    if (user) {
      axios.post(`${process.env.REACT_APP_API}/posts/create`, postCtx?.state);
    }

    postCtx?.dispatch({ type: ActionEnum.CLEAR });
    actions.openCreatePost(false);
    setTimeout(() => {
      handleFetchPosts();
    }, 500);
  };

  const checkCorrectPost = () => {
    if (userPickedImage) {
      if (
        postCtx?.state!.headline!.trim().length >= 3 &&
        postCtx?.state!.category!.trim().length >= 1 &&
        postCtx?.state!.file!.length > 3 &&
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

    if (
      postCtx?.state!.headline!.length >= 3 &&
      postCtx?.state!.category!.length > 1
    ) {
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
  }, [postCtx?.state, correctImage, userPickedImage]);

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
          value={postCtx?.state.headline}
          onChange={e =>
            postCtx?.dispatch({
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
      {!correctFormatPost && postCtx?.state!.headline!.length > 0 && (
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
            onChange={e =>
              postCtx?.dispatch({ type: ActionEnum.SET_NOTIFICATION })
            }
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
        disabled={!correctFormatPost}
        onClick={() => createNewPost()}
      >
        Create post
      </button>
    </section>
  );
};

export default memo(CreatePost);

// TODO Pagination posts,comments, messages
