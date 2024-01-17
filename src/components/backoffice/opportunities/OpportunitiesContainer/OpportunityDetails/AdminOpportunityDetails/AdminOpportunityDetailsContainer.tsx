import React, { useEffect, useRef, useState } from 'react';
import { OpportunityDetails } from '../OpportunityDetails';
import { useFetchAdminOpportunity } from '../useFetchOpportunity';
import { useOpportunityDetailsHeight } from '../useOpportunityDetailsHeight';
import { HEIGHTS } from 'src/constants/styles';
import { useOpportunityId } from 'src/hooks/queryParams/useOpportunityId';
import { AdminOpportunityDetails } from './AdminOpportunityDetails';
import {
  CTAsByTag,
  getOpportunityCurrentTag,
} from './AdminOpportunityDetailsCTAs/AdminOpportunityDetailsCTAs.utils';

export function AdminOpportunityDetailsContainer({
  fetchOpportunities,
  filtersAndTabsHeight,
}: {
  fetchOpportunities: () => void;
  filtersAndTabsHeight: number;
}) {
  const opportunityId = useOpportunityId();

  const { opportunity, isLoading, refreshOpportunity } =
    useFetchAdminOpportunity(opportunityId, fetchOpportunities);

  const ref = useRef();

  const [hasCTAContainer, setHasCTAContainer] = useState(true);

  const { containerHeight } = useOpportunityDetailsHeight(
    filtersAndTabsHeight,
    HEIGHTS.OFFER_ADMIN_INFO_HEIGHT - HEIGHTS.DEFAULT_SECTION_PADDING,

    // @ts-expect-error after enable TS strict mode. Please, try to fix it
    ref,
    hasCTAContainer
  );

  useEffect(() => {
    if (opportunity) {
      const hasCTAs =
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        CTAsByTag.find(({ tag }) => {
          return tag === getOpportunityCurrentTag(opportunity);
        })?.ctas.length > 0;

      setHasCTAContainer(hasCTAs);
    }
  }, [hasCTAContainer, opportunity]);

  if (!opportunityId || !opportunity) {
    return <OpportunityDetails isLoading={isLoading} />;
  }

  return (
    <OpportunityDetails
      contentHeight={filtersAndTabsHeight}
      details={
        <AdminOpportunityDetails
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          innerRef={ref}
          containerHeight={containerHeight}
          hasCTAContainer={hasCTAContainer}
          opportunity={opportunity}
          oppRefreshCallback={refreshOpportunity}
          fetchOpportunities={fetchOpportunities}
        />
      }
      isLoading={isLoading}
    />
  );
}
