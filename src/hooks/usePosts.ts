import { useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { fetchPosts } from '../api/posts';

export const usePosts = () => {
  const [sortType, setSortType] = useState<string | undefined>('');
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(['projects', sortType], fetchPosts, {
    getNextPageParam: lastPage =>
      lastPage.data.hasNextPage ? lastPage.data.currentPage + 1 : undefined,
    meta: { sortType }, //pass any data to api call
    refetchOnWindowFocus: false,
  });

  const changePostSort = (e: any) => {
    if (!e.value) return;

    setSortType(e?.value);
  };

  return {
    data,
    error,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    changePostSort,
  };
};
