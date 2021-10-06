import { ChangeEvent, FC, useState, useEffect, memo } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Category from './Category/Category';
import CropImage from './CropImage';
import { CreatePostI } from '../../Interfaces/posts/postInterfaces';
import useNotification from '../../Hooks/Notifications/useNotification';
import { CookieUser } from '../../Interfaces/auth/authInterface';
import { useCounter } from '../../store/sub';

interface CreateProps {
  handleFetchPosts: () => void;
}

const CreatePost: FC<CreateProps> = ({ handleFetchPosts }) => {
  const [cookies] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;

  const [, actions] = useCounter();

  const [post, setPost] = useState<CreatePostI>({
    headline: '',
    file: '',
    category: '',
    userId: user ? user._id : '',
    notification: false,
  });

  const [correctImage, setCorrectImage] = useState<boolean>(false);
  const [userPickedImage, setUserPickedImage] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [correctFormatPost, setCorrectFormatPost] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(false);
  const { checkNotificationSupport, checkUserPermission } = useNotification();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;

    setPost({ ...post, [name]: value });
  };

  const createNewPost = async () => {
    if (user) {
      axios.post(`${process.env.REACT_APP_API}/posts/create`, post);
    }

    setPost({ headline: '', file: '', category: '', notification: false });
    actions.openCreatePost(false);
    setTimeout(() => {
      handleFetchPosts();
    }, 500);
  };

  const checkCorrectPost = () => {
    if (userPickedImage) {
      if (
        post!.headline!.trim().length >= 3 &&
        post!.category!.trim().length >= 1 &&
        post!.file!.length > 3 &&
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

    if (post!.headline!.length >= 3 && post!.category!.length > 1) {
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
  }, [post, correctImage, userPickedImage]);

  useEffect(() => {}, []);

  const handleNotification = () => {
    const permission = checkUserPermission();

    if (permission) {
      console.log('granted');
    }
  };

  return (
    <section className="create-post">
      <h2 data-testid="create-post__header">Create new post</h2>
      <label className="create-post__label">
        <input
          data-testid="headline"
          value={post.headline}
          onChange={e => handleChange(e)}
          type="text"
          name="headline"
          placeholder="Write something interesting"
          className="create-post__title"
        />
      </label>

      <Category chooseCategory={post.category} setPost={setPost} post={post} />
      <CropImage
        setMessage={setMessage}
        post={post}
        setPost={setPost}
        setUserPickedImage={setUserPickedImage}
        setCorrectImage={setCorrectImage}
        correctImage={correctImage}
      />
      {disable && <p>Loading image...</p>}
      {!correctFormatPost && post!.headline!.length > 0 && (
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
              setPost({ ...post, notification: !post.notification })
            }
            className="create-post__notifications"
          />
          <p className="create-post__notifications-text">
            Receive notification{' '}
            <span>{`${
              !checkUserPermission() ? '(Notifications are disabled)' : ''
            }`}</span>
          </p>
        </label>
      )}
      {/* {checkNotificationSupport && info.length >= 2 && (
          )} */}

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

// TODO COMPONENT HELP

// TODO RESET HASLA

// TODO Pagination posts,comments, messages

// TODO DELETED USER
