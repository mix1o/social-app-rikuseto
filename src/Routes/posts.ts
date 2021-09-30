import Posts from '../Components/Posts/Posts';
import CreatePost from '../Components/Posts/CreatePost';
import SharedPost from '../Components/Posts/SharedPost/SharedPost';
import SavedPosts from '../Components/Account/SavedPosts';
import UserPosts from '../Components/Account/UserPosts';
import Details from '../Components/Account/Details/Details';

export const PostsRoute = {
  component: Posts,
  url: '/',
  exact: true,
  permission: false,
};

export const CreatePostRoute = {
  component: CreatePost,
  url: '/new-post',
  exact: true,
  permission: true,
};

export const SharedPostRoute = {
  component: SharedPost,
  url: '/post/:id',
  exact: true,
  permission: false,
};

export const SavedPostsRoute = {
  component: SavedPosts,
  url: '/account/saved-posts',
  exact: true,
  permission: true,
};
export const YourPostsRoute = {
  component: UserPosts,
  url: '/account/your-posts',
  exact: true,
  permission: true,
};
export const UserDetails = {
  component: Details,
  url: '/account/details',
  exact: true,
  permission: true,
};
