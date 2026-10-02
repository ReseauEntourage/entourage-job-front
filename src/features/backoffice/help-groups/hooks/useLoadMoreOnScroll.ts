import { useEffect, useState } from 'react';
import { useIsAtBottom } from '@/src/hooks/useIsAtBottom';

interface UseLoadMoreOnScrollParams {
  hasNextPage: boolean;
  isFetching: boolean;
  // The last request failed: no automatic retry, the reader retries from the
  // error state or by reaching the bottom again
  hasError?: boolean;
  fetchNextPage: () => unknown;
}

// The scroll position cannot change on a page shorter than the viewport, so
// no "bottom reached" event would ever fire there
const isPageBottomVisible = () =>
  window.innerHeight + window.scrollY >= document.body.offsetHeight - 1;

/**
 * Loads the next page of an infinite query each time the reader reaches the
 * bottom of the page. A bottom reached while a request is in flight is kept
 * pending and served once it completes, and pages keep loading while the
 * bottom of the page stays visible (a short list never scrolls).
 */
export const useLoadMoreOnScroll = ({
  hasNextPage,
  isFetching,
  hasError = false,
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
    if (isFetching) {
      return;
    }
    if (!hasNextPage) {
      setIsLoadRequested(false);
      return;
    }
    if (isLoadRequested || (!hasError && isPageBottomVisible())) {
      setIsLoadRequested(false);
      fetchNextPage();
    }
  }, [isLoadRequested, isFetching, hasError, hasNextPage, fetchNextPage]);
};
