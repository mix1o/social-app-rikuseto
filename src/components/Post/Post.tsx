import { FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import Author from '../Author/Author';
import { PostInterfaceExtended } from '../../interfaces/posts/postInterfaces';
import { ModalType, openModal } from '../../features/modalSlice';
import { AnimatePresence as Presence } from 'framer-motion';
import { useTopComment } from '../../hooks/useTopComment';
import { LikedElement } from '../../enums/LikedElement';
import relativeTime from 'dayjs/plugin/relativeTime';
import LikeButton from '../LikeButton/LikeButton';
import { useUser } from '../../hooks/useUser';
import PostTopComment from './PostTopComment';
import Comments from '../Comments/Comments';
import { useDispatch } from 'react-redux';
import {
  Category,
  Dots,
  DotsContainer,
  PostBarComments,
  PostButton,
  PostContent,
  PostHeadline,
  PostImage,
  PostImageWrapper,
  PostInfo,
  PostWrapper,
} from './styled';

const Post: FC<PostInterfaceExtended> = ({
  _id,
  userId,
  headline,
  category,
  file,
  likes,
  date,
}) => {
  const [openComments, setOpenComments] = useState(false);
  const [isShare, setIsShare] = useState(false);
  const dispatch = useDispatch();

  const { user } = useUser();
  const { data: comment } = useTopComment(_id);
  dayjs.extend(relativeTime);

  const location = useLocation();

  useEffect(() => {
    location.pathname.includes('post') ? setIsShare(true) : setIsShare(false); //we can just pass props to component like isShared
  }, [location.pathname]);

  return (
    <PostWrapper>
      {user && (
        <DotsContainer>
          <Dots>
            <div
              onClick={() =>
                dispatch(
                  openModal({
                    type: ModalType.POST_ACTIONS,
                    details: { id: _id, userId },
                  })
                )
              }
            >
              <i className="fas fa-ellipsis-v"></i>
            </div>
          </Dots>
        </DotsContainer>
      )}
      <Author id={userId}>
        <Category>
          Posted on: <span>{category}</span> {dayjs(date).fromNow()}
        </Category>
      </Author>
      <PostContent>
        <PostHeadline>{headline}</PostHeadline>
      </PostContent>
      {file.length > 3 && (
        <PostImageWrapper>
          <PostImage src={file} alt={headline} />
        </PostImageWrapper>
      )}
      <PostInfo>
        <LikeButton likes={likes} id={_id} type={LikedElement.Post} />
        {!isShare && (
          <div>
            <PostButton onClick={() => setOpenComments(true)}>
              <span>{comment?.allComments}</span>
              comments
            </PostButton>

            <PostButton
              onClick={() =>
                dispatch(
                  openModal({
                    type: ModalType.POST_SHARE,
                    details: { id: _id, userId: '' },
                  })
                )
              }
            >
              Share <i className="fas fa-share"></i>
            </PostButton>
          </div>
        )}
      </PostInfo>
      {!isShare && <PostTopComment comment={comment} />}
      {!isShare && comment && (
        <PostBarComments
          isTopComment={comment.allComments >= 1}
          onClick={() => setOpenComments(true)}
        >
          {comment.allComments >= 1 ? (
            <p>
              View all comments <span>&#40;{comment?.allComments}&#41;</span>
            </p>
          ) : (
            <p>Be this first one to comment</p>
          )}
        </PostBarComments>
      )}
      <Presence exitBeforeEnter>
        {openComments && (
          <Comments
            key={_id}
            postId={_id}
            authorId={userId}
            setOpenComments={setOpenComments}
          />
        )}
      </Presence>
    </PostWrapper>
  );
};

export default Post;
