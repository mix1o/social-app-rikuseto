import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PostInterface } from '../../../Interfaces/posts/postInterfaces';
import Post from '../Post';
import Header from '../../Header/Header';
import { BlurredMenu } from '../../Animations/Popup';
import Comments from '../../Comments/Comments';
import { AnimatePresence as Presence } from 'framer-motion';

const SharedPost: FC = () => {
  const { id } = useParams<{ id: string }>();

  const [post, setPost] = useState<PostInterface[]>();
  const [correct, setCorrect] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPost = (): void => {
    axios.get(`${process.env.REACT_APP_API}/posts/post?id=${id}`).then(res => {
      if (res.data.valid === false) {
        setCorrect(false);
        setLoading(false);
        return;
      }
      setPost(res.data);
      setCorrect(true);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const [popup, setPopup] = useState<boolean>(false);

  return (
    <>
      <Header />

      <div className="post__container-shared">
        {correct &&
          !loading &&
          post?.map(
            ({ _id, userId, headline, category, file, likes, date }) => (
              <Post
                key={_id}
                _id={_id}
                userId={userId}
                headline={headline}
                category={category}
                file={file}
                likes={likes}
                date={date}
                refreshPosts={fetchPost}
              />
            )
          )}
      </div>
      {correct && (
        <>
          <p className="post__shared-text">Comments:</p>

          <Comments
            postId={id}
            fetchTopComment={() => {}}
            setOpenComments={() => {}}
            view={true}
            authorId={post![0].userId}
          />
        </>
      )}
      {!correct && !loading && (
        <>
          <p className="post__shared-error">Content not found</p>
          <div className="post__shared-container-links">
            <Link className="post__shared-link" to="/">
              Back to explore
            </Link>
            <Link className="post__shared-link" to="/">
              Report a bug
            </Link>
          </div>
        </>
      )}
      <Presence initial={false} exitBeforeEnter>
        {popup && <BlurredMenu stateHandler={setPopup} />}
      </Presence>
    </>
  );
};

export default SharedPost;
