import { FC } from 'react';
import { Link } from 'react-router-dom';

interface ISearchedUser {
  avatar: string;
  firstName: string;
  lastName: string;
  _id: string;
  view?: boolean;
}

const SearchUser: FC<ISearchedUser> = ({
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

export default SearchUser;
