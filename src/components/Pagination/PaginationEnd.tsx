import { useRef } from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { PaginationInfoWrapper, PaginationContent } from './Styles';

interface PaginationProps {
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
}
const PaginationEnd = ({
  fetchNextPage = () => {},
  isFetchingNextPage,
  isLoading,
  hasNextPage = false,
  isError,
}: PaginationProps) => {
  const targetIntersect = useRef(null);
  useIntersectionObserver({
    onIntersect: fetchNextPage,
    target: targetIntersect,
    enabled: hasNextPage,
    threshold: 0.8,
  });
  //TODO more generic styles
  return (
    <PaginationInfoWrapper>
      {/* First new page */}
      <PaginationContent ref={targetIntersect}>
        <p>{isFetchingNextPage ? 'Loading more...' : ''}</p>
      </PaginationContent>
      {/* First page load */}
      {isLoading && (
        <PaginationContent>
          <p> Loading </p>
        </PaginationContent>
      )}
      {!hasNextPage && !isLoading && (
        <PaginationContent>
          <p>You've scrolled to the end 🎉</p>
        </PaginationContent>
      )}
      {isError && (
        <PaginationContent>
          <p>Something went terrible wrong</p>
        </PaginationContent>
      )}
    </PaginationInfoWrapper>
  );
};

export default PaginationEnd;
