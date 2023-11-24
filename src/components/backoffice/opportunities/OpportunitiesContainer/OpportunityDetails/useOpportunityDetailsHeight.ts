import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import { useWindowHeight } from '@react-hook/window-size';
import { MutableRefObject, useState } from 'react';
import { HEIGHTS } from 'src/constants/styles';

export const useOpportunityDetailsHeight = (
  tabsHeights: number,
  ref: MutableRefObject<HTMLElement>,
  hasCTAContainer: boolean
) => {
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const windowHeight = useWindowHeight();

  useScrollPosition(
    ({ currPos }) => {
      const conditionalHeight = hasCTAContainer
        ? HEIGHTS.OFFER_CTA_HEIGHT
        : -HEIGHTS.SECTION_PADDING;

      const bottom =
        windowHeight - HEIGHTS.HEADER - tabsHeights - conditionalHeight;

      const calculatedContainerHeight = bottom - currPos.y;

      setContainerHeight(
        calculatedContainerHeight < 2 * HEIGHTS.SECTION_PADDING
          ? 2 * HEIGHTS.SECTION_PADDING
          : calculatedContainerHeight
      );
    },
    [windowHeight, hasCTAContainer],
    ref
  );

  return { containerHeight };
};
