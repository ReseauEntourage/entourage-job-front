import { useWindowScrollPosition } from '@n8tb1t/use-scroll-position';
import { useWindowHeight } from '@react-hook/window-size';
import { useEffect, useState } from 'react';
import { usePrevious } from '@/src/hooks/utils';

export const useIsAtBottom = (
  setOffset?: (offset: ((prevOffset: number) => number) | number) => void
) => {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const prevIsAtBottom = usePrevious(isAtBottom);
  const windowHeight = useWindowHeight();

  useEffect(() => {
    if (isAtBottom && isAtBottom !== prevIsAtBottom) {
      if (setOffset) {
        setOffset((prevOffset) => {
          return prevOffset + 1;
        });
      }
    }
  }, [setOffset, isAtBottom, prevIsAtBottom]);

  // In v4 `currPos.y` is the positive scroll offset (it was negated in v2).
  useWindowScrollPosition(({ currPos }) => {
    if (!isAtBottom && currPos.y >= document.body.offsetHeight - windowHeight) {
      setIsAtBottom(true);
    } else {
      setIsAtBottom(false);
    }
  });
};
