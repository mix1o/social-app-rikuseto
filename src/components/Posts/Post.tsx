import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Comments from '../Comments/Comments';
import { LikedElements } from '../../hooks/LikedElements';
import moment from 'moment';

interface Post {
  _id: string;
  user_id: string;
  headline: string;
  category: string;
  file: string;
  likes: string[];
  date: string;
  onClickLike: () => void;
  author: string;
}

const Post: FC<Post> = ({
  _id,
  user_id,
  headline,
  category,
  file,
  likes,
  onClickLike,
  date,
  author,
}) => {
  const [cookies] = useCookies();
  const { user } = cookies;
  const [liked, setLiked] = useState<boolean | undefined>(false);
  const [openComments, setOpenComments] = useState<boolean>(false);

  const handleLikePost = (id: string, user_id: string) => {
    axios
      .post(`${process.env.REACT_APP_API}/posts/like`, {
        postId: id,
        userId: user_id,
      })
      .then(() => {
        onClickLike();
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    const like = LikedElements(user, likes);
    setLiked(like);
    return;
  }, [likes]);

  return (
    <div style={{ background: '#333', color: '#fff', textAlign: 'center' }}>
      <p>{author}</p>
      <p>{headline}</p>
      <p>{category}</p>
      <p>{moment(date).fromNow()}</p>
      <img
        style={{ width: '90%', height: '200px' }}
        src={file}
        alt={headline}
      />
      <div>
        Stars {likes.length}
        <button
          style={liked ? { background: 'green' } : { background: 'gray' }}
          onClick={() => {
            if (user) {
              handleLikePost(_id, user._id);
            }
          }}
        >
          Add Star
        </button>
        <button onClick={() => setOpenComments(true)}>Comments</button>
      </div>
      {openComments && (
        <Comments postId={_id} setOpenComments={setOpenComments} />
      )}
    </div>
  );
};

export default Post;
