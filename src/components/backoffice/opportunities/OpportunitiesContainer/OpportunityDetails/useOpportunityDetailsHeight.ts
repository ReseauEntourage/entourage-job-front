import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import { useWindowHeight } from '@react-hook/window-size';
import { MutableRefObject, useState } from 'react';
import { HEIGHTS } from 'src/constants/styles';

export const useOpportunityDetailsHeight = (
  filtersAndTabsHeight: number,
  opportunityInfoHeight: number,
  ref: MutableRefObject<HTMLElement>,
  hasCTAContainer: boolean
) => {
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const windowHeight = useWindowHeight();

  useScrollPosition(
    ({ currPos }) => {
      const conditionalHeight = hasCTAContainer ? HEIGHTS.OFFER_CTA_HEIGHT : 0;

      const fixedContentHeight =
        HEIGHTS.HEADER +
        filtersAndTabsHeight +
        opportunityInfoHeight +
        conditionalHeight -
        HEIGHTS.DEFAULT_SECTION_PADDING;

      const calculatedContainerHeight =
        windowHeight - fixedContentHeight - (currPos.y < 0 ? 0 : currPos.y);

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
