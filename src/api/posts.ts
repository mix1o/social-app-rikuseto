import axios from 'axios';
import { QueryMeta } from 'react-query';
import { PostInterface } from '../interfaces/posts/postInterfaces';

interface QueryType {
  meta: QueryMeta | undefined;
  signal?: AbortSignal | undefined;
  pageParam?: number;
}

interface PostResponse {
  hasNextPage: boolean;
  currentPage: number;
  posts?: PostInterface[];
}

export const fetchPosts = async ({ pageParam = 1, meta }: QueryType) => {
  try {
    const response = await axios.get<PostResponse>(
      `${process.env.REACT_APP_API}/posts/get?page=${pageParam}${meta?.sortType}`
    );
    return response;
  } catch (err: any) {
    throw new Error(err);
  }
};

//TODO: export functions (sortPosts etc)
