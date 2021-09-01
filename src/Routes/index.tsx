import { FC } from 'react';
import { AuthRoute, AccountRoute } from './auth';
import {
  PostsRoute,
  CreatePostRoute,
  SharedPostRoute,
  SavedPostsRoute,
  YourPostsRoute,
} from './posts';
import { CategoriesRoutes } from './categories';
import { ProfileRoutes } from './profile';
import { MessagesRoutes, ConversationRoute } from './messages';
import { NotificationRoutes } from './notifications';

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
  CategoriesRoutes,
  ProfileRoutes,
  MessagesRoutes,
  ConversationRoute,
  NotificationRoutes,
  //   CreatePostRoute,
];
