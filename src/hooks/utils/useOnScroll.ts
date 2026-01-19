import React from 'react';
import { useCallback, useState } from 'react';

const OFFSET_TO_FETCH = 150;

const enableFetchRef = {
  current: true,
};

interface UseOnScrollParams {
  onScrollBottomEnd?: () => void | Promise<unknown>;
  onScrollTopEnd?: () => void | Promise<unknown>;
}

export function useOnScroll(params: UseOnScrollParams = {}) {
  const [isAtTop, setIsAtTop] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const { onScrollBottomEnd, onScrollTopEnd } = params;

  const onScroll = useCallback(
    async (event: React.UIEvent<HTMLElement>) => {
      const { scrollHeight, offsetHeight, scrollTop } = event.currentTarget;
      const scrollExist = scrollHeight > offsetHeight;

      if (!scrollExist) {
        return;
      }

      const scrollIsAtBottom =
        offsetHeight + scrollTop > scrollHeight - OFFSET_TO_FETCH;
      const scrollIsAtTop = scrollTop - OFFSET_TO_FETCH < 0;

      if (scrollIsAtBottom && !isAtBottom) {
        setIsAtBottom(true);
      } else if (!scrollIsAtBottom && isAtBottom) {
        setIsAtBottom(false);
      }

      if (scrollIsAtTop && !isAtTop) {
        setIsAtTop(true);
      } else if (!scrollIsAtTop && isAtTop) {
        setIsAtTop(false);
      }

      if (scrollIsAtBottom && onScrollBottomEnd) {
        if (enableFetchRef.current) {
          enableFetchRef.current = false;
          try {
            await onScrollBottomEnd();
            enableFetchRef.current = true;
          } catch {
            // do nothing
          }
        }
      }

      if (scrollIsAtTop && onScrollTopEnd) {
        if (enableFetchRef.current) {
          enableFetchRef.current = false;
          try {
            await onScrollTopEnd();
            enableFetchRef.current = true;
          } catch {
            // do nothing
          }
        }
      }
    },
    [onScrollBottomEnd, onScrollTopEnd, isAtTop, isAtBottom]
  );

  return {
    onScroll,
    isAtBottom,
    isAtTop,
  };
}
