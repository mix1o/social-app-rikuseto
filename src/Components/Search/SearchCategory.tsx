import { FC, useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useCookies } from 'react-cookie';
import { CategoryArray } from '../../interfaces/posts/category';
import { CookieUser } from '../../interfaces/auth/authInterface';

type ResUser = { user: CookieUser };

const SearchCategory: FC<Omit<CategoryArray, 'user_id'>> = ({
  name,
  totalPosts,
  _id,
  view,
}) => {
  const [text, setText] = useState('Add now');
  const [cookies, setCookie] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;

  const handleAddCategory = (id: string) => {
    axios
      .put(`${process.env.REACT_APP_API}/category/add`, {
        id,
        userId: user._id,
      })
      .then((res: AxiosResponse<ResUser>) => {
        setCookie('user', res.data.user, { path: '/' });
        checkCategory(res.data.user);
      });
  };

  const checkCategory = (currentUser: CookieUser) => {
    setText('Add now');
    currentUser.categories?.forEach(id => {
      if (id === _id) {
        setText('Remove');
      }
    });
  };

  useEffect(() => {
    checkCategory(user);
  }, []);

  return (
    <div
      className={`searched searched__category ${
        view ? 'searched__background' : ''
      }`}
    >
      <p className="searched__name searched__name--display">
        {name}
        <span className="searched__category--count">
          {totalPosts} unique posts
        </span>
      </p>
      <button
        onClick={() => handleAddCategory(_id)}
        className="searched__category--action"
      >
        {text}
      </button>
    </div>
  );
};

export default SearchCategory;
