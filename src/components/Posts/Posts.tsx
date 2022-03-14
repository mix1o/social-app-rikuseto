import { FC } from 'react';
import Header from '../Header/Header';
import Post from '../Post/Post';
import { usePosts } from '../../hooks/usePosts';
import PaginationEnd from '../Pagination/PaginationEnd';
import { CustomSelect } from '../../helpers/selectStyles.styled';
import CreatePost from '../CreatePost/CreatePost';
import { CreatePostProvider } from '../../hooks/useCreatePost';
import { useCookies } from 'react-cookie';
import { CookieUser } from '../../interfaces/auth/authInterface';

const filterOptions = [
  {
    label: 'Most likes',
    value: '&order=asc&sort=likes',
  },
  {
    label: 'Least likes',
    value: '&order=desc&sort=likes',
  },
  {
    label: 'Most Comments',
    value: '&order=asc&sort=comments',
  },
  {
    label: 'Least Comments',
    value: '&order=desc&sort=comments',
  },
  {
    label: 'Popular',
    value: '&order=asc&sort=popular', //TODO more fitlers
  },
  {
    label: 'Rising',
    value: '&order=asc&sort=rising', //TODO more fitlers
  },
];

const Posts: FC = () => {
  const {
    data,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isLoading,
    changePostSort,
  } = usePosts();

  return (
    <>
      <Header />
      <CustomSelect
        classNamePrefix="react-select"
        options={filterOptions}
        onChange={changePostSort}
        defaultValue={filterOptions[0]}
        isSearchable={false}
      />
      {status === 'success'
        ? data?.pages.map(response =>
            response.data.posts?.map(post => (
              <Post
                key={post._id}
                _id={post._id}
                headline={post.headline}
                category={post.category}
                file={post.file}
                userId={post.userId}
                likes={post.likes}
                date={post.date}
              />
            ))
          )
        : null}

      <PaginationEnd
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isError={isError}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isLoading}
      />
    </>
  );
};

export default Posts;
