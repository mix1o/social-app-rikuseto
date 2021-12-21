import axios from 'axios';
import { useQuery, useQueryClient } from 'react-query';
import { TopComment } from '../interfaces/comments/commentsInterfaces';
import { AuthorInterface } from '../interfaces/common/common';

export const useTopComment = (commentId: string) => {
  const queryClient = useQueryClient();

  return useQuery<TopComment>(
    ['comment-top', commentId],
    () =>
      axios
        .get(`${process.env.REACT_APP_API}/comments/top?postId=${commentId}`)
        .then(res => res.data),
    {
      // onSuccess: () => {
      //   queryClient.invalidateQueries(['comment-author', commentId]);
      // },
      staleTime: 1000000,
    }
  );
};

export const useCommentAuthor = (authorId?: string) =>
  useQuery<AuthorInterface>(
    ['comment-author', authorId],
    async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/author?userId=${authorId}`
      );

      return res.data;
    },
    { enabled: false }
  );
