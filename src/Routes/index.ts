import { FC, ReactChild } from 'react';
import { AuthRoute, AccountRoute } from './auth';
import {
  PostsRoute,
  SharedPostRoute,
  SavedPostsRoute,
  YourPostsRoute,
  UserDetails,
} from './posts';
import { CategoriesRoutes } from './categories';
import { ProfileRoutes } from './profile';
import { ConversationsRoutes, ConversationRoute } from './conversations';
import { NotificationRoutes } from './notifications';
import { NotFoundRoute, NotFoundAllRoute } from './other';
import { SearchedDataRoute } from './search';

interface RouteProps<T> {
  Component: FC<T>;
  url?: string;
  exact?: boolean;
  permission: boolean;
}

export const Routes: RouteProps<ReactChild>[] = [
  AuthRoute,
  PostsRoute,
  SharedPostRoute,
  AccountRoute,
  SavedPostsRoute,
  YourPostsRoute,
  CategoriesRoutes,
  ProfileRoutes,
  ConversationsRoutes,
  ConversationRoute,
  NotificationRoutes,
  NotFoundRoute,
  SearchedDataRoute,
  UserDetails,
  NotFoundAllRoute,
];
