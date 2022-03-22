interface Messages {
  loadingNextPage: string;
  loading: string;
  finalPage: string;
  error: string;
}
export interface PaginationProps {
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  customMessages?: Messages;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
}
