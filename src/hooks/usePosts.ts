import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { fetchPosts } from '../api/posts';
import { PostInterface } from '../interfaces/posts/postInterfaces';

export const usePosts = () => {
  const { isLoading, isError, data, error } = useQuery('posts', fetchPosts, {
    onSuccess: () => {
      console.log('Posts fetched'); //For now can be console
    },
    onError: () => {
      throw new Error('Fetching posts failed');
    },
  });

  return {
    isLoading,
    isError,
    data,
    error,
  };
};
