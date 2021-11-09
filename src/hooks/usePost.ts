import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
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

export const useGetAllPosts = (type: fetchType, url: string) => {
  return useQuery<PostInterface[]>(
    `${type}`,
    async () => {
      const res = await axios.get(`${process.env.REACT_APP_API}${url}`);
      return res.data;
    },
    {
      staleTime: 1000000,
    }
  );
};
