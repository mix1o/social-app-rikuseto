import Posts from '../components/Posts/Posts';
import CreatePost from '../components/Posts/CreatePost';
import SharedPost from '../components/Posts/SharedPost/SharedPost';
import SavedPosts from '../components/Account/SavedPosts';
import UserPosts from '../components/Account/UserPosts';

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
  url: '/saved-posts',
  exact: true,
  permission: true,
};
export const YourPostsRoute = {
  component: UserPosts,
  url: '/your-posts',
  exact: true,
  permission: true,
};
