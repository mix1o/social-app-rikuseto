import { useAuthor } from '../../hooks/useAuthor';
import { useTopComment } from '../../hooks/useTopComment';
import Author from '../Author/Author';

const PostTopComment = ({ comment }: { comment: any }) => {
  return (
    <div>
      {comment?.topComment && (
        <div>
          <Author
            id={comment?.topComment?.userId ? comment.topComment.userId : ''}
          />
          //TODO display top comment
        </div>
      )}
    </div>
  );
};

export default PostTopComment;
