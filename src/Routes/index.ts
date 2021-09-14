import { FC, ReactChild } from 'react';
import { AuthRoute, AccountRoute } from './auth';
import {
  PostsRoute,
  SharedPostRoute,
  SavedPostsRoute,
  YourPostsRoute,
} from './posts';
import { CategoriesRoutes } from './categories';
import { ProfileRoutes } from './profile';
import { ConversationsRoutes, ConversationRoute } from './conversations';
import { NotificationRoutes } from './notifications';
import { NotFoundRoute, NotFoundAllRoute } from './other';

interface RouteProps<T> {
  component: FC<T>;
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
  NotFoundAllRoute,
];
