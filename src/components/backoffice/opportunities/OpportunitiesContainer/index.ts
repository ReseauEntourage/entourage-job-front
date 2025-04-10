import type { JSX } from 'react';
import { plateform } from 'src/utils/Device';
import { OpportunitiesContainerDesktop } from './OpportunitiesContainer.desktop';
import { OpportunitiesContainerMobile } from './OpportunitiesContainer.mobile';
import { OpportunitiesContainerProps } from './OpportunitiesContainer.types';

export const OpportunitiesContainer: (
  props: OpportunitiesContainerProps
) => JSX.Element = plateform({
  Desktop: OpportunitiesContainerDesktop,
  Mobile: OpportunitiesContainerMobile,
});
