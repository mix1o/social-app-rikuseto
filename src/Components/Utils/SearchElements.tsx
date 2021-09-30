import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { useCookies } from 'react-cookie';
import { CategoryArray } from '../../Interfaces/posts/category';
import { CookieUser } from '../../Interfaces/auth/authInterface';

interface ISearchedUser {
  avatar: string;
  firstName: string;
  lastName: string;
  _id: string;
  view?: boolean;
}

type ResUser = { user: CookieUser };

const SearchedUser: FC<ISearchedUser> = ({
  avatar,
  firstName,
  lastName,
  _id,
  view,
}) => {
  return (
    <div className={`searched ${view ? 'searched__background' : ''}`}>
      <Link to={`/profile/${_id}`} className="searched__user-link">
        <img
          src={avatar}
          alt={`User ${firstName} profile`}
          className={`searched__user-profile ${
            view ? 'searched-view__user-profile' : ''
          }`}
        />
        <p className="searched__name">
          <span className="searched__user-firstN">{firstName}</span>{' '}
          <span className="searched__user-lastN">{lastName}</span>
        </p>
      </Link>
    </div>
  );
};

const SearchedCategory: FC<Omit<CategoryArray, 'user_id'>> = ({
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

export { SearchedCategory, SearchedUser };
