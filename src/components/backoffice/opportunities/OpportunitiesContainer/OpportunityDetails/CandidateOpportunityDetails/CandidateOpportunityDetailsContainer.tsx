import React from 'react';
import { OpportunityDetails } from '../OpportunityDetails';
import { useFetchOpportunity } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/useFetchOpportunity';
import { useOpportunityId } from 'src/components/backoffice/opportunities/useOpportunityId';
import CandidateOpportunityDetails from './CandidateOpportunityDetails';

export const CandidateOpportunityDetailsContainer = ({
  fetchOpportunities,
  candidateId,
}: {
  fetchOpportunities: () => void;
  candidateId: string;
}) => {
  const opportunityId = useOpportunityId();

  const { opportunity, isLoading, refreshOpportunity } = useFetchOpportunity(
    opportunityId,
    candidateId,
    fetchOpportunities
  );

  if (!opportunityId || !opportunity) {
    return <OpportunityDetails isLoading={isLoading} />;
  }

  return (
    <OpportunityDetails
      details={
        <CandidateOpportunityDetails
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
          createdAt={opportunity.createdAt}
          events={opportunity.opportunityUsers.events}
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
