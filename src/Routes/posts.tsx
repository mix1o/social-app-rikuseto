import Posts from '../components/Posts/Posts';
import CreatePost from '../components/Posts/CreatePost';
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
