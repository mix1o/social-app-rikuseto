import { FC } from 'react';
import { AuthRoute, AccountRoute } from './auth';
import {
  PostsRoute,
  CreatePostRoute,
  SharedPostRoute,
  SavedPostsRoute,
  YourPostsRoute,
} from './posts';

interface RouteProps<T> {
  component: FC<T>;
  url: string;
  exact: boolean;
}

export const Routes: RouteProps<any>[] = [
  AuthRoute,
  PostsRoute,
  SharedPostRoute,
  AccountRoute,
  SavedPostsRoute,
  YourPostsRoute,
  //   CreatePostRoute,
];
