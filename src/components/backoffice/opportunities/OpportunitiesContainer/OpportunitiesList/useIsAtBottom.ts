import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import { useWindowHeight } from '@react-hook/window-size';
import { useState, useEffect } from 'react';
import { usePrevious } from 'src/hooks/utils';

export const useIsAtBottom = (setOffset, opportunities) => {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const prevIsAtBottom = usePrevious(isAtBottom);
  const windowHeight = useWindowHeight();
  const prevOpportunitiesLength = usePrevious(opportunities.length);

  useEffect(() => {
    if (isAtBottom && isAtBottom !== prevIsAtBottom) {
      if (setOffset) {
        setOffset((prevOffset) => {
          return prevOffset + 1;
        });
      }
    }
  }, [
    setOffset,
    isAtBottom,
    prevIsAtBottom,
    opportunities.length,
    prevOpportunitiesLength,
  ]);

  useScrollPosition(
    ({ currPos }) => {
      if (
        !isAtBottom &&
        currPos.y * -1 === document.body.offsetHeight - windowHeight
      ) {
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    },
    [windowHeight]
  );
};
