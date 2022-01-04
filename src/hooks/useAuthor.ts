import { useQuery } from 'react-query';
import { getAuthor } from '../api/author';

export const useAuthor = (authorId: string) => {
  return useQuery(['author', authorId], async () => {
    const author = await getAuthor(authorId);
    return author?.data;
  });
};
