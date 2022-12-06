import { plateform } from 'src/utils/Device';
import OpportunitiesContainerDesktop from 'src/components/opportunities/OpportunitiesContainer/OpportunitiesContainer.desktop';
import OpportunitiesContainerMobile from 'src/components/opportunities/OpportunitiesContainer/OpportunitiesContainer.mobile';

export const OpportunitiesContainer = plateform({
  Desktop: OpportunitiesContainerDesktop,
  Mobile: OpportunitiesContainerMobile,
});
