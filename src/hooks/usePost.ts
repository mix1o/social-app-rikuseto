import axios from 'axios';
import { useMutation, useQuery, useQueryClient, QueryCache } from 'react-query';

import {
  ActionEnum,
  CreatePostI,
  PostInterface,
} from '../interfaces/posts/postInterfaces';
import { useCounter } from '../store/sub';
import { useCreatePostCtx } from './useCreatePost';

type fetchType = 'all-posts' | 'user-posts';

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const [, { openCreatePost }] = useCounter();
  const { dispatch } = useCreatePostCtx();

  return useMutation(
    (newPost: CreatePostI) =>
      axios
        .post(`${process.env.REACT_APP_API}/posts/create`, newPost)
        .then(res => res.data),

    {
      retry: 3,
      onSettled: () => {
        queryClient.invalidateQueries('all-posts');
        queryClient.invalidateQueries('user-posts');
      },
      onSuccess: () => {
        dispatch({ type: ActionEnum.CLEAR });
        openCreatePost(false);
      },
    }
  );
};

export const useGetAllPosts = (type: fetchType, url: string) =>
  useQuery<PostInterface[]>(
    `${type}`,
    async () => {
      const res = await axios.get(`${process.env.REACT_APP_API}${url}`);
      return res.data;
    },
    {
      staleTime: 1000000,
    }
  );

export const useLikePost = (postId: string, userId: string) => {
  const queryClient = useQueryClient();
  return useQuery(
    'like-post',
    () => {
      axios
        .post(`${process.env.REACT_APP_API}/posts/like`, {
          postId,
          userId,
        })
        .then(res => res.data);
    },
    {
      enabled: false,
      onSuccess: () => {
        queryClient.invalidateQueries('all-posts');
        queryClient.invalidateQueries('user-posts');
      },
    }
  );
};
