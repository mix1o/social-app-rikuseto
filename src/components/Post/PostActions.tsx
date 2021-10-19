import axios from 'axios';
import { Dispatch, FC, SetStateAction, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { CookieUser } from '../../interfaces/auth/authInterface';

interface PostActionsI {
  id: string;
  userId: string;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  refreshPosts: () => void;
}

const PostActions: FC<PostActionsI> = ({
  id,
  userId,
  setIsEdit,
  refreshPosts,
}) => {
  const [cookies, setCookie] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;
  const [savedPost, setSavedPost] = useState<boolean>(false);

  const checkIsSaved = (updatedUserPosts: string[]) => {
    setSavedPost(false);
    if (updatedUserPosts) {
      updatedUserPosts.forEach((element: string) => {
        if (element.toString() === id.toString()) {
          setSavedPost(true);
        } else {
          setSavedPost(false);
        }
      });
    }
  };

  useEffect(() => {
    checkIsSaved(user.savedPosts);
  }, []);

  const savePost = () => {
    axios
      .put(`${process.env.REACT_APP_API}/posts/save`, {
        id,
        userId: user._id,
      })
      .then(res => {
        checkIsSaved(res.data.updatedUser.savedPosts);
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

  return (
    <div className="post__container-dots-actions">
      {user && user._id !== userId && (
        <>
          <button
            onClick={() => {
              savePost();

              setTimeout(() => {
                refreshPosts();
              }, 200);
            }}
            className="post__action"
          >
            {savedPost ? 'Unsave' : 'Save post'}
            <i className="fas fa-flag"></i>
          </button>
          <button className="post__action">
            Report
            <i className="fas fa-ban"></i>
          </button>
        </>
      )}
      {user && user._id === userId ? (
        <>
          <button onClick={() => setIsEdit(true)} className="post__action">
            Edit
            <i className="fas fa-edit"></i>
          </button>
          <button
            onClick={deletePost}
            className="post__action post__action--delete"
          >
            Delete
            <i className="fas fa-trash-alt"></i>
          </button>
        </>
      ) : null}
    </div>
  );
};

export default PostActions;
