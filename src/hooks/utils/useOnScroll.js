import { useCallback, useState } from 'react';

const OFFSET_TO_FETCH = 150;

const enableFetchRef = {
  current: true,
};

export function useOnScroll({ onScrollBottomEnd, onScrollTopEnd }) {
  const [isAtTop, setIsAtTop] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const onScroll = useCallback(
    async (event) => {
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
          } catch (e) {
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
          } catch (e) {
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
