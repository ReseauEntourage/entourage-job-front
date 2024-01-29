import { useCallback, useEffect, useState } from 'react';
import { useIsAtBottom } from './useIsAtBottom';
import { usePrevious } from './utils';

export function useLoadMore(loadMoreCallback: () => Promise<void>) {
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [hasFetchedAll, setHasFetchedAll] = useState(false);
  const prevOffset = usePrevious(offset);

  useIsAtBottom(setOffset);

  useEffect(() => {
    const loadMore = async () => {
      setIsLoading(true);
      await loadMoreCallback();
      setIsLoading(false);
    };
    if (prevOffset !== offset && (offset === 0 || !hasFetchedAll)) {
      loadMore();
    }
  }, [prevOffset, offset, hasFetchedAll, loadMoreCallback]);

  const resetOffset = useCallback(() => {
    setOffset(0);
    setHasFetchedAll(false);
  }, []);

  return { isLoading, offset, resetOffset };
}
