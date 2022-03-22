import { useRef } from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { PaginationProps } from '../../interfaces/common/paggination';
import { PaginationInfoWrapper, PaginationContent } from './Styles';

const defaultMessages = {
  error: 'Something went terrible wrong',
  finalPage: "You've scrolled to the end 🎉",
  loading: 'Loading',
  loadingNextPage: 'Loading more..',
};

const PaginationEnd = ({
  fetchNextPage = () => {},
  isFetchingNextPage,
  isLoading,
  hasNextPage = false,
  isError,
  customMessages = defaultMessages,
}: PaginationProps) => {
  const targetIntersect = useRef(null);
  useIntersectionObserver({
    onIntersect: fetchNextPage,
    target: targetIntersect,
    enabled: hasNextPage,
    threshold: 0.8,
  });

  return (
    <PaginationInfoWrapper>
      <PaginationContent ref={targetIntersect}>
        <p>{isFetchingNextPage ? customMessages.loadingNextPage : ''}</p>
      </PaginationContent>
      {isLoading && (
        <PaginationContent>
          <p>{customMessages.loading}</p>
        </PaginationContent>
      )}
      {!hasNextPage && !isLoading && (
        <PaginationContent>
          <p>{customMessages.finalPage}</p>
        </PaginationContent>
      )}
      {isError && (
        <PaginationContent>
          <p>{customMessages.error}</p>
        </PaginationContent>
      )}
    </PaginationInfoWrapper>
  );
};

export default PaginationEnd;
