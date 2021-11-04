import { FC } from 'react';
import { CreatePostProvider } from '../hooks/useCreatePost';

const CreatePostCtx: FC = ({ children }) => {
  return (
    <>
      <CreatePostProvider>{children}</CreatePostProvider>
    </>
  );
};

export default CreatePostCtx;
