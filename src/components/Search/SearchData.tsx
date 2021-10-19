import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { handleFetch } from '../../helpers/handleSearch';
import { CategoryArray } from '../../interfaces/posts/category';
import { PostInterface } from '../../interfaces/posts/postInterfaces';
import SearchCategory from './SearchCategory';
import SearchUser from './SearchUser';
import { CookieUser } from '../../interfaces/auth/authInterface';
import Header from '../Header/Header';
import Post from '../Post/Post';

interface responseInterface {
  categories: Omit<CategoryArray, 'user_id'>[];
  posts: PostInterface[];
  users: CookieUser[];
}

const SearchedData: FC = () => {
  const { value } = useParams<{ value: string }>();

  const [responseData, setResponseData] = useState<
    | responseInterface
    | {
        categories: [];
        posts: [];
        users: [];
      }
  >();

  const fetchData = async () => {
    const { data, status } = await handleFetch(value, '');

    if (status === 200) {
      setResponseData(data);
    }
  };

  useEffect(() => {
    fetchData();
  }, [value]);

  return (
    <>
      <Header />
      <main className="searched">
        <section className="searched__section">
          <h3 className="searched__header">Users</h3>
          {responseData?.users.map(({ firstName, lastName, avatar, _id }) => (
            <SearchUser
              key={_id}
              avatar={avatar}
              firstName={firstName}
              lastName={lastName}
              _id={_id}
              view={true}
            />
          ))}
        </section>
        <section className="searched__section">
          <h3 className="searched__header">Categories</h3>
          <div className="searched__section-wrapper">
            {responseData?.categories.map(({ name, totalPosts, _id }) => (
              <SearchCategory
                key={_id}
                _id={_id}
                name={name}
                totalPosts={totalPosts}
                view={true}
              />
            ))}
          </div>
        </section>
        <section className="searched__section searched__posts">
          <h3 className="searched__header">Posts</h3>
          {responseData?.posts.map(
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
                  refreshPosts={fetchData}
                  date={date}
                />
              );
            }
          )}
        </section>
      </main>
    </>
  );
};

export default SearchedData;
