import { ChangeEvent, FC, useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Category from './Category/Category';
import CropImage from './CropImage';
import { CreatePostI } from '../../interfaces/posts/postInterfaces';
import Picker from 'emoji-picker-react';
import useNotification from '../../Notifications/useNotification';
import { checkPermission } from '../../helpers/CheckPermission';

interface CreateProps {
  handleFetchPosts: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreatePost: FC<CreateProps> = ({ handleFetchPosts, setOpen }) => {
  const [cookies] = useCookies();
  const { user } = cookies;

  const [post, setPost] = useState<CreatePostI>({
    headline: '',
    file: '',
    category: '',
    user_id: user ? user._id : '',
    notification: false,
  });

  const [correctImage, setCorrectImage] = useState<boolean>(false);
  const [userPickedImage, setUserPickedImage] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [correctFormatPost, setCorrectFormatPost] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(false);
  const [isOpenEmoji, setIsOpenEmoji] = useState<boolean>(false);
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
    setOpen(false);
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

  const onEmojiClick = (event: any, emojiObject: any) => {
    setPost({ ...post, headline: post.headline + emojiObject.emoji });
  };

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
        onClick={() => setOpen(prevVal => !prevVal)}
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
            <button
              className="create-post__btn-emoji"
              onClick={() => setIsOpenEmoji(prevState => !prevState)}
            >
              <i className="fas fa-smile" />
            </button>
          </label>
          {isOpenEmoji && (
            <Picker
              pickerStyle={{
                width: '100%',
                background: 'var(--light-bg-400)',
                boxShadow: 'none',
                border: '1px solid var(--font-dark-600)',
                marginTop: '1rem',
              }}
              disableSearchBar={true}
              onEmojiClick={onEmojiClick}
            />
          )}
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
          <button onClick={subscribeToPushNotification}>
            SUBSCRIBE TO NOTIFICATIOn
          </button>
          <button onClick={sendTest}>test noti</button>

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

// TODO Mapowanie friendsów w komponencie messages
// TODO MESSAGES - zapisywanie w mongo
// TODO STYLE dla messages

// TODO Wyświetlanie postów z ulubionymi kategoriami

// TODO Friends request
