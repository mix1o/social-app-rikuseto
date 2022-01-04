import axios from 'axios';
import { useQuery, useQueryClient } from 'react-query';
import { TopComment } from '../interfaces/comments/commentsInterfaces';

export const useTopComment = (id: string) => {
  return useQuery<TopComment>(
    ['comment-top', id],
    () =>
      axios
        .get(`${process.env.REACT_APP_API}/comments/top?postId=${id}`)
        .then(res => res.data),
    {
      staleTime: 1000000,
    }
  );
};
