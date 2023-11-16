import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import { useState } from 'react';

export const useOpportunityDetailsHeight = (
  windowHeight,
  hasCTAContainer,
  heights,
  ref
) => {
  const [containerHeight, setContainerHeight] = useState<number>(0);

  useScrollPosition(
    ({ currPos }) => {
      const conditionalHeight = hasCTAContainer
        ? heights.OFFER_CTA_HEIGHT
        : -heights.SECTION_PADDING;

      const bottom =
        windowHeight - heights.HEADER - heights.TABS_HEIGHT - conditionalHeight;

      const calculatedContainerHeight = bottom - currPos.y;

      setContainerHeight(
        calculatedContainerHeight < 2 * heights.SECTION_PADDING
          ? 2 * heights.SECTION_PADDING
          : calculatedContainerHeight
      );
    },
    [windowHeight, hasCTAContainer],
    ref
  );

  return { containerHeight };
};
