import { ChangeEvent, FC, useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Category from './Category/Category';
import CropImage from './CropImage';
import { CreatePostI } from '../../interfaces/posts/postInterfaces';

import useNotification from '../../Notifications/useNotification';
import { checkPermission } from '../../helpers/CheckPermission';
import { CookieUser } from '../../interfaces/auth/authInterface';
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
  const { checkNotificationSupport, subscribeToPushNotification } =
    useNotification();

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
        post!.headline!.length >= 3 &&
        post!.category!.length > 1 &&
        post!.file!.length > 3 &&
        correctImage
      ) {
        setDisable(false);
        setMessage('');
        return true;
      } else {
        setMessage('Accept your image');
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
  }, [post, message, correctImage, userPickedImage]);

  useEffect(() => {}, []);

  const handleNotification = () => {
    const permission = checkPermission();

    if (permission) {
      console.log('granted');
    }
  };

  const sendTest = () => {
    axios.post(`${process.env.REACT_APP_API}/user/test-notification`, post);
  };

  return (
    <div className="blurred__options create">
      <div
        className="blurred__blurred-bg"
        onClick={() => actions.openCreatePost(false)}
      ></div>
      <div
        style={{
          position: 'relative',
          height: '70vh',
          overflow: 'scroll',
        }}
        className="blurred__option"
      >
        <section
          style={{
            marginTop: '2rem',
          }}
          className="create-post"
        >
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

          <Category
            chooseCategory={post.category}
            setPost={setPost}
            post={post}
          />
          <CropImage
            setMessage={setMessage}
            post={post}
            setPost={setPost}
            setUserPickedImage={setUserPickedImage}
            setCorrectImage={setCorrectImage}
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
              style={{ color: 'var(--font-dark-600)' }}
            >
              <input
                type="checkbox"
                onChange={e =>
                  setPost({ ...post, notification: !post.notification })
                }
              />
              <p>
                Receive notification{' '}
                <span>{`${
                  !checkPermission() ? '(Notifications are disabled)' : ''
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
      </div>
    </div>
  );
};

export default CreatePost;

// TODO Aktualizowanie statusu powiadomienia (seen or not)

// TODO Wyświetlanie postów z ulubionymi kategoriami

// TODO Szukanie kategorii, userow, postow

// TODO FILRTOWANIE POSTOW

// TODO Login details

// TODO COMPONENT HELP

// TODO RESET HASLA

// TODO CLOSE LOGIN POPUP WHEN SUCESS

// TODO REMOVE NOTIFICAITONS SERVICE WORKER | Styles for checkbox

// TODO Conversations last message, find new friends when user doesnt have any friend

// TODO FLOATER Post

// TODO SCROLL Message

// TODO Pagination posts,comments, messages

// TODO UPLOAD AVATARA

// TODO USUWANIE WIADOMOSCI

// TODO Type profile user, typo
