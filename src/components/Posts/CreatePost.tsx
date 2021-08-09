import { ChangeEvent, FC, useState, useEffect } from 'react';
import Compressor from 'compressorjs';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Category from './Category';
interface Post {
  headline?: string;
  file?: string;
  category?: string;
  user_id?: string;
}

interface CreateProps {
  handleFetchPosts: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreatePost: FC<CreateProps> = ({ handleFetchPosts, setOpen }) => {
  const [cookies] = useCookies();
  const { user } = cookies;

  const [post, setPost] = useState<Post>({
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

  const [newCategory, setNewCategory] = useState('');

  const upload = (data: any) => {
    axios
      .post('https://api.imgur.com/3/image/', data, {
        headers: {
          Authorization: `Client-ID ${process.env.REACT_APP_IMGUR_KEY}`,
        },
      })
      .then(res => {
        setUserPickedImage(true);

        if (res.status === 403) {
          setCorrectImage(false);
          setMessage('Something went wrong. Please try again');
          return;
        }
        setTimeout(() => {
          setPost({ ...post, file: res.data.data.link });
        }, 1000);
        setCorrectImage(true);
        setMessage('Your image is correct uploaded');
      });
  };

  const compressImg = (file: any) => {
    if (!file) return;

    const firstImg = file[0];

    new Compressor(firstImg, {
      quality: 0.6,
      convertSize: 268000,
      success(result) {
        const formData = new FormData();

        formData.append('file', result);

        upload(result);
      },
      error(err) {
        console.log(err.message);
      },
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;

    setPost({ ...post, [name]: value });
  };
  console.log(post);
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
          <label
            onDrop={e => console.log(e)}
            onDragOver={e => console.log(e)}
            onDragEnter={e => console.log(e)}
            onDragLeave={e => console.log(e)}
            htmlFor="add-file"
            className="create-post__drag-drop"
          >
            <p className="create-post__text">
              Drag and Drop or{' '}
              <span className="create-post__pseudo-btn">Click</span>
            </p>
          </label>
          <input
            id="add-file"
            className="create-post__file-input"
            onClick={() => {
              setDisable(true);
            }}
            onFocus={() => {
              setDisable(false);
            }}
            type="file"
            accept="image/*"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              compressImg(e.target.files);
              setAreFiles(true);
            }}
          />

          {/* <div className="create-category">
          <h3>Create new Category</h3>
          <input
            type="text"
            placeholder="newCategory"
            onChange={e => {
              setNewCategory(e.target.value);
            }}
          />
          <button
            onClick={() => {
              axios
                .post(`${process.env.REACT_APP_API}/category/new`, {
                  name: newCategory,
                })
                .then(res => console.log(res));
            }}
          >
            Create New Category
          </button>
          <br />
          <br />
        </div> */}
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
