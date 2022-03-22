import dayjs from 'dayjs';
import { TopComment } from '../../interfaces/comments/commentsInterfaces';
import Author from '../Author/Author';
import { TopCommentDate, TopCommentText, TopCommentWrapper } from './styled';

const PostTopComment = ({ comment }: { comment: TopComment | undefined }) => {
  return (
    <>
      {comment?.topComment && (
        <TopCommentWrapper>
          <Author
            id={comment?.topComment?.userId ? comment.topComment.userId : ''}
          >
            <TopCommentText>{comment.topComment.text}</TopCommentText>
          </Author>
          <TopCommentDate>
            {dayjs(comment.topComment.date).fromNow()}
          </TopCommentDate>
        </TopCommentWrapper>
      )}
    </>
  );
};

export default PostTopComment;
