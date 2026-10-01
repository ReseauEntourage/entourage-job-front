import { useEffect, useState } from 'react';
import { useIsAtBottom } from '@/src/hooks/useIsAtBottom';

interface UseLoadMoreOnScrollParams {
  hasNextPage: boolean;
  isFetching: boolean;
  fetchNextPage: () => unknown;
}

/**
 * Loads the next page of an infinite query each time the reader reaches the
 * bottom of the page.
 */
export const useLoadMoreOnScroll = ({
  hasNextPage,
  isFetching,
  fetchNextPage,
}: UseLoadMoreOnScrollParams) => {
  const [bottomReachedCount, setBottomReachedCount] = useState(0);
  useIsAtBottom(setBottomReachedCount);

  useEffect(() => {
    if (bottomReachedCount > 0 && hasNextPage && !isFetching) {
      fetchNextPage();
    }
    // Only react to a new bottom reached event
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bottomReachedCount]);
};
