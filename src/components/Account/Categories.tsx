import axios from 'axios';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Header from '../Header/Header';
import { checkUser } from './IsLogged/isLoggedUser';
import { PostInterface } from '../../interfaces/posts/postInterfaces';
import Post from '../Posts/Post';

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

  const [cookies] = useCookies();
  const { user } = cookies;

  const userFavoriteCategories = () => {
    axios
      .get(
        `${process.env.REACT_APP_API}/category/get-categories?userId=${user._id}`
      )
      .then(res => setUserCategories(res.data));
  };

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

  const fetchPostByCategory = () => {
    if (search.length > 0) {
      axios
        .get(
          `${process.env.REACT_APP_API}/posts/get-by-category?category=${search}`
        )
        .then(res => setPosts(res.data));
    }
  };

  useEffect(() => {
    if (search.length === 0) setPosts([]);
  }, [search]);

  useEffect(() => {
    checkUser(user);
    fetchCategories();
    userFavoriteCategories();
  }, []);

  useEffect(() => {
    const time = setTimeout(() => {
      fetchPostByCategory();
    }, 1000);

    return () => clearTimeout(time);
  }, [search]);

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
          {posts?.map(
            ({ _id, headline, category, file, user_id, likes, date }) => {
              return (
                <Post
                  key={_id}
                  _id={_id}
                  headline={headline}
                  category={category}
                  file={file}
                  user_id={user_id}
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
