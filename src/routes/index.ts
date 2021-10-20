import { FC, ReactChild } from 'react';
import { AuthRoute, AccountRoute, NewPasswordRoute } from './auth';
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
import { NotFoundRoute, NotFoundAllRoute, AboutRoute } from './other';
import { SearchedDataRoute } from './search';
import { ContactRoute } from './contact';

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
  ContactRoute,
  NewPasswordRoute,
  AboutRoute,
  NotFoundAllRoute,
];
