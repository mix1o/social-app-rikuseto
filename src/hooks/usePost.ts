import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { CookieUser } from '../interfaces/auth/authInterface';
import { popularInterface } from '../interfaces/posts/category';
import {
  ActionEnum,
  CreatePostI,
  fetchType,
  PostInterface,
} from '../interfaces/posts/postInterfaces';
import { useCounter } from '../store/sub';
import { useCreatePostCtx } from './useCreatePost';

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

export const useGetAllPosts = ({
  type,
  url,
}: {
  type: fetchType;
  url: string;
}) => {
  const queryClient = useQueryClient();
  return useQuery<PostInterface[]>(
    `${type}`,
    async () => {
      const res = await axios.get(`${process.env.REACT_APP_API}${url}`);

      return res.data;
    },
    {
      initialData: [],
      // staleTime: 1000000,
      //  cacheTime:
    }
  );
  // {
  // }
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  const [cookies] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;

  return useMutation(
    'like-post',
    async (postId: string) => {
      const res = await axios.post(`${process.env.REACT_APP_API}/posts/like`, {
        postId,
        userId: user._id,
      });
      return res.data;
    },

    {
      retry: 3,
      retryDelay: 10000,
      onSuccess: () => {
        queryClient.invalidateQueries('all-posts');
        queryClient.invalidateQueries('user-posts');
        queryClient.invalidateQueries('created-posts');
      },
    }
  );
};

export const usePopularCategories = () =>
  useQuery<popularInterface[]>('popular-categories', () =>
    axios
      .get(`${process.env.REACT_APP_API}/category/popular-categories`)
      .then(res => res.data)
  );

export const useUserPosts = ({ userId }: { userId: string }) => {
  return useQuery<PostInterface[]>('created-posts', async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API}/posts/user-posts?userId=${userId}`
    );
    return res.data;
  });
};
