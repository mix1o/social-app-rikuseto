import { ChangeEvent, FC, useState, useEffect } from 'react';
import Compressor from 'compressorjs';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Category from './Category';
import CropImage from './CropImage';
import { CreatePostI } from '../../interfaces/posts/postInterfaces';
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
  });

  const [correctImage, setCorrectImage] = useState<boolean>(false);
  const [userPickedImage, setUserPickedImage] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [correctFormatPost, setCorrectFormatPost] = useState<boolean>(false);
  const [disable, setDisable] = useState(false);
  const [areFiles, setAreFiles] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;

    setPost({ ...post, [name]: value });
  };

  const createNewPost = () => {
    if (user) {
      axios.post(`${process.env.REACT_APP_API}/posts/create`, post).then(() => {
        setPost({ headline: '', file: '', category: '' });
        handleFetchPosts();
        setOpen(false);
      });
    }
  };

  const checkCorrectPost = () => {
    if (userPickedImage) {
      setAreFiles(false);
      if (
        post!.headline!.length >= 3 &&
        post!.category!.length > 1 &&
        post!.file!.length > 3 &&
        correctImage
      ) {
        setDisable(false);
        return true;
      } else {
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
  }, [post, message, correctImage]);

  const updateCat = () => {
    axios.post(`${process.env.REACT_APP_API}/category/add-category`, {
      userId: user._id,
      categoryId: '610d31764dd43a3c15e0b010',
    });
  };

  const onEmojiClick = (event: any, emojiObject: any) => {
    setPost({ ...post, headline: post.headline + emojiObject.emoji });
  };

  return (
    <div className="blurred__options create">
      <div
        className="blurred__blurred-bg"
        onClick={() => setOpen(prevVal => !prevVal)}
      ></div>
      <div className="blurred__option">
        <section className="create-post">
          <h2 data-testid="create-post__header">Create new post</h2>
          <input
            data-testid="headline"
            value={post.headline}
            onChange={e => handleChange(e)}
            type="text"
            name="headline"
            placeholder="Write something interesting"
            className="create-post__title"
          />
          <Category
            handleChange={handleChange}
            chooseCategory={post.category}
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
          {!disable && !areFiles && (
            <button
              className="create-post__btn-add"
              data-testid="button"
              disabled={!correctFormatPost}
              onClick={createNewPost}
            >
              Create post
            </button>
          )}
        </section>
      </div>
    </div>
  );
};

export default CreatePost;
