import Posts from '../Components/Posts/Posts';
import CreatePost from '../Components/Posts/CreatePost';
import SharedPost from '../Components/Posts/SharedPost/SharedPost';
import SavedPosts from '../Components/Account/SavedPosts';
import UserPosts from '../Components/Account/UserPosts';
import Details from '../Components/Account/Details/Details';

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
