import axios from 'axios';
import { useEffect, useState } from 'react';
import { useUser } from './useUser';

export const usePostActions = (id: string) => {
  const { user, setCookie } = useUser();
  const { savedPosts } = user;
  const [isSavedPost, setIsSavedPost] = useState<boolean>();

  useEffect(() => {
    if (savedPosts) {
      const index = savedPosts.findIndex(postId => postId === id);
      index !== -1 ? setIsSavedPost(true) : setIsSavedPost(false);
    }
  }, []);

  const savePost = () => {
    setIsSavedPost(!isSavedPost);
    axios
      .put(`${process.env.REACT_APP_API}/posts/save`, {
        id,
        userId: user._id,
      })
      .then(res => {
        setCookie('user', res.data.updatedUser, { path: '/' });
      });
  };

  const deletePost = () => {
    axios.delete(`${process.env.REACT_APP_API}/posts/delete`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        postId: id,
      },
    });
    window.location.reload();
  };
  return {
    isSavedPost,
    savePost,
    deletePost,
  };
};
