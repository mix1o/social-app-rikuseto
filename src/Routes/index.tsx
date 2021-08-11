import { FC } from 'react';
import { AuthRoute } from './auth';
import { PostsRoute, CreatePostRoute, SharedPostRoute } from './posts';

interface RouteProps<T> {
  component: FC<T>;
  url: string;
  exact: boolean;
}

export const Routes: RouteProps<any>[] = [
  AuthRoute,
  PostsRoute,
  SharedPostRoute,
  //   CreatePostRoute,
];
