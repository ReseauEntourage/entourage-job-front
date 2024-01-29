import React, { useEffect, useRef, useState } from 'react';
import { OpportunityDetails } from '../OpportunityDetails';
import { useOpportunityDetailsHeight } from '../useOpportunityDetailsHeight';
import { tabs } from 'src/components/backoffice/candidate/CandidateOpportunities/CandidateOffersTab/CandidateOffersTab.utils';
import { useFetchCandidateOpportunity } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/useFetchOpportunity';
import { HEIGHTS } from 'src/constants/styles';
import { useOpportunityId } from 'src/hooks/queryParams/useOpportunityId';
import { CandidateOpportunityDetails } from './CandidateOpportunityDetails';
import { CTAsByTab } from './CandidateOpportunityDetailsCTAs/CandidateOpportunityDetailsCTAs.utils';

export const CandidateOpportunityDetailsContainer = ({
  fetchOpportunities,
  candidateId,
  filtersAndTabsHeight,
}: {
  fetchOpportunities: () => void;
  candidateId: string;
  filtersAndTabsHeight: number;
}) => {
  const opportunityId = useOpportunityId();

  const { opportunity, isLoading, refreshOpportunity } =
    useFetchCandidateOpportunity(
      opportunityId,
      candidateId,
      fetchOpportunities
    );

  const ref = useRef();

  const [hasCTAContainer, setHasCTAContainer] = useState(true);

  useEffect(() => {
    if (opportunity) {
      const index = tabs.findIndex(
        ({ status }: { status: (string | number)[] }) => {
          if (opportunity.opportunityUsers?.archived) {
            return status.includes('archived');
          }
          return status.includes(
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            opportunity.opportunityUsers?.status
          );
        }
      );

      const hasCTAs =
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        CTAsByTab.find((tab) => {
          return tab.tab === index;
        })?.ctas.length > 0;

      setHasCTAContainer(hasCTAs);
    }
  }, [hasCTAContainer, opportunity]);

  const { containerHeight } = useOpportunityDetailsHeight(
    filtersAndTabsHeight,
    HEIGHTS.OFFER_INFO_HEIGHT,

    // @ts-expect-error after enable TS strict mode. Please, try to fix it
    ref,
    hasCTAContainer
  );

  if (!opportunityId || !opportunity) {
    return <OpportunityDetails isLoading={isLoading} />;
  }

  return (
    <OpportunityDetails
      contentHeight={filtersAndTabsHeight}
      details={
        <CandidateOpportunityDetails
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          innerRef={ref}
          containerHeight={containerHeight}
          hasCTAContainer={hasCTAContainer}
          id={opportunity.id}
          department={opportunity.department}
          title={opportunity.title}
          description={opportunity.description}
          company={opportunity.company}
          companyDescription={opportunity.companyDescription}
          contract={opportunity.contract}
          startOfContract={opportunity.startOfContract}
          endOfContract={opportunity.endOfContract}
          businessLines={opportunity.businessLines}
          isPublic={opportunity.isPublic}
          isExternal={opportunity.isExternal}
          opportunityUsers={opportunity.opportunityUsers}
          fetchOpportunities={fetchOpportunities}
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          createdAt={opportunity.createdAt}
          events={
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            opportunity.opportunityUsers.events
          }
          oppRefreshCallback={() => {
            refreshOpportunity();
          }}
          candidateId={candidateId}
        />
      }
      isLoading={isLoading}
    />
  );
};
