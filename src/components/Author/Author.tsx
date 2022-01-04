import { Link } from 'react-router-dom';
import { useAuthor } from '../../hooks/useAuthor';
import { useUser } from '../../hooks/useUser';
import { AuthorInterface } from '../../interfaces/common/common';
import { Wrapper, Image, FullName } from './styled';

const Author = ({ id }: { id: string }) => {
  const { data: author } = useAuthor(id);
  const { user } = useUser();

  return (
    <>
      {author && (
        <Wrapper>
          <Image src={author.avatar} alt="User photo" />
          <Link
            className="post__author-link"
            to={user && user._id === id ? '/account' : `/profile/${id}`}
          >
            <FullName>
              {author.status === 200
                ? `${author.firstName} ${author.lastName}`
                : 'Deleted'}
            </FullName>
          </Link>
        </Wrapper>
      )}
    </>
  );
};

export default Author;
