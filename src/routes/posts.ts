import Posts from '../components/Posts/Posts';
import CreatePost from '../components/CreatePost/CreatePost';
import SharedPost from '../components/SharedPost/SharedPost';
import SavedPosts from '../components/Details/SavedPosts';
import UserPosts from '../components/Details/UserPosts';
import Details from '../components/Details/Details';

export const PostsRoute = {
  Component: Posts,
  url: '/',
  exact: true,
  permission: false,
};

export const CreatePostRoute = {
  Component: CreatePost,
  url: '/new-post',
  exact: true,
  permission: true,
};

export const SharedPostRoute = {
  Component: SharedPost,
  url: '/post/:id',
  exact: true,
  permission: false,
};

export const SavedPostsRoute = {
  Component: SavedPosts,
  url: '/account/saved-posts',
  exact: true,
  permission: true,
};
export const YourPostsRoute = {
  Component: UserPosts,
  url: '/account/your-posts',
  exact: true,
  permission: true,
};
export const UserDetails = {
  Component: Details,
  url: '/account/details',
  exact: true,
  permission: true,
};
