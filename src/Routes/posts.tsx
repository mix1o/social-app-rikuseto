import Posts from '../components/Posts/Posts';
import CreatePost from '../components/Posts/CreatePost';
import SharedPost from '../components/Posts/SharedPost/SharedPost';

export const PostsRoute = {
  component: Posts,
  url: '/',
  exact: true,
};

export const CreatePostRoute = {
  component: CreatePost,
  url: '/new-post',
  exact: true,
};

export const SharedPostRoute = {
  component: SharedPost,
  url: '/post/:id',
  exact: true,
};
