import axios from 'axios';
import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Header from '../Header/Header';
import { PostInterface } from '../../interfaces/posts/postInterfaces';
import Post from '../Posts/Post';
import { CookieUser } from '../../interfaces/auth/authInterface';

interface CategoryI {
  _id: string;
  totalPosts: number;
  name: string;
}

const Categories: FC = () => {
  const [categories, setCategories] = useState<CategoryI[]>();
  const [userCategories, setUserCategories] = useState<CategoryI[]>();
  const [posts, setPosts] = useState<PostInterface[]>();

  const [search, setSearch] = useState<string>('');
  const [isSearched, setIsSearched] = useState<boolean>(false);

  const [cookies] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;

  const userFavoriteCategories = useCallback(() => {
    axios
      .get(
        `${process.env.REACT_APP_API}/category/get-categories?userId=${user._id}`
      )
      .then(res => setUserCategories(res.data));
  }, [user._id]);

  const fetchCategories = () => {
    axios
      .get(`${process.env.REACT_APP_API}/category/get-all`)
      .then(res => setCategories(res.data));
  };

  const handleAddCategory = (id: string) => {
    axios.put(`${process.env.REACT_APP_API}/category/add`, {
      id,
      userId: user._id,
    });

    setTimeout(() => {
      userFavoriteCategories();
    }, 500);
  };

  const fetchPostByCategory = useCallback(() => {
    setIsSearched(false);
    if (search.length > 0) {
      axios
        .get(
          `${process.env.REACT_APP_API}/posts/get-by-category?category=${search}`
        )
        .then(res => {
          setPosts(res.data);
          setIsSearched(true);
        });
    }
  }, [search]);

  useEffect(() => {
    if (search.length === 0) setPosts([]);
  }, [search]);

  useEffect(() => {
    fetchCategories();
    userFavoriteCategories();
  }, [userFavoriteCategories]);

  useEffect(() => {
    const time = setTimeout(() => {
      fetchPostByCategory();
    }, 1000);

    return () => clearTimeout(time);
  }, [fetchPostByCategory]);

  return (
    <>
      <Header />
      <div className="categories">
        <h3 className="categories__headline">
          Browse categories and personalize it
        </h3>
        <div className="categories__container-input">
          <input
            type="text"
            placeholder="Search category"
            className="categories__input"
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
          />
        </div>
        <div className="categories__container">
          {categories
            ?.filter(element => {
              return element.name.includes(search);
            })
            .map(({ name, totalPosts, _id }, idx) => {
              let text = 'Add now';
              userCategories?.filter(element => {
                if (element._id === _id) {
                  text = 'Remove';
                }
                return null;
              });

              return (
                <div key={idx} className="categories__single-category">
                  <div className="categories__details">
                    <p className="categories__name">{name}</p>
                    <p className="categories__total">{totalPosts} posts</p>
                  </div>
                  <div className="categories__actions">
                    <button
                      onClick={() => handleAddCategory(_id)}
                      className="categories__btn"
                    >
                      {text}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="categories__posts">
          {isSearched && posts?.length === 0 && (
            <h3 style={{ textAlign: 'center' }}>
              We don't found posts with{' '}
              <span style={{ color: '#753eed' }}>{search}</span> category
            </h3>
          )}
          {posts?.map(
            ({ _id, headline, category, file, userId, likes, date }) => {
              return (
                <Post
                  key={_id}
                  _id={_id}
                  headline={headline}
                  category={category}
                  file={file}
                  userId={userId}
                  likes={likes}
                  refreshPosts={fetchPostByCategory}
                  date={date}
                />
              );
            }
          )}
        </div>
      </div>
    </>
  );
};

export default Categories;
