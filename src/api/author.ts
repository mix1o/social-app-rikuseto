import axios from 'axios';
import { AuthorInterface } from '../interfaces/common/common';

export const getAuthor = async (authorId: string) => {
  if (authorId === '') return;

  try {
    const response = await axios.get<AuthorInterface>(
      `${process.env.REACT_APP_API}/author?userId=${authorId}`
    );

    return response;
  } catch (e) {}
};
