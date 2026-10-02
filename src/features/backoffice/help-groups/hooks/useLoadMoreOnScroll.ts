import { useEffect, useState } from 'react';
import { useIsAtBottom } from '@/src/hooks/useIsAtBottom';

interface UseLoadMoreOnScrollParams {
  hasNextPage: boolean;
  isFetching: boolean;
  fetchNextPage: () => unknown;
}

/**
 * Loads the next page of an infinite query each time the reader reaches the
 * bottom of the page. A bottom reached while a request is in flight is kept
 * pending and served once it completes, so a short page keeps paginating.
 */
export const useLoadMoreOnScroll = ({
  hasNextPage,
  isFetching,
  fetchNextPage,
}: UseLoadMoreOnScrollParams) => {
  const [bottomReachedCount, setBottomReachedCount] = useState(0);
  const [isLoadRequested, setIsLoadRequested] = useState(false);
  useIsAtBottom(setBottomReachedCount);

  useEffect(() => {
    if (bottomReachedCount > 0) {
      setIsLoadRequested(true);
    }
  }, [bottomReachedCount]);

  useEffect(() => {
    if (!isLoadRequested || isFetching) {
      return;
    }
    setIsLoadRequested(false);
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [isLoadRequested, isFetching, hasNextPage, fetchNextPage]);
};
