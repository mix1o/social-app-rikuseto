import { FC } from 'react';
import Header from '../Header/Header';
import Post from '../Post/Post';
import { usePosts } from '../../hooks/usePosts';
import PaginationEnd from '../Pagination/PaginationEnd';
import { CustomSelect } from '../../helpers/selectStyles.styled';
import ContentLoader from '../Animations/Skeleton';
import styled from 'styled-components';

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
  // {
  //   label: 'Popular',
  //   value: '&order=asc&sort=popular',
  // },
  {
    label: 'Rising',
    value: '&order=asc&sort=rising',
  },
];

const Main = styled.main`
  display: grid;
  place-content: start center;
  margin: 0 auto;
`;

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
      <Main>
        <CustomSelect
          classNamePrefix="react-select"
          options={filterOptions}
          onChange={changePostSort}
          defaultValue={filterOptions[0]}
          isSearchable={false}
        />
        {status === 'loading' && (
          <ContentLoader totalItems={data?.pages ? 2 : 5} />
        )}
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
      </Main>
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
