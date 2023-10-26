import React from 'react';
import { useOpportunityId } from '../../../useOpportunityId';
import { OpportunityDetails } from '../OpportunityDetails';
import { useFetchAdminOpportunity } from '../useFetchOpportunity';
import { AdminOpportunityDetails } from './AdminOpportunityDetails';

export function AdminOpportunityDetailsContainer({
  fetchOpportunities,
}: {
  fetchOpportunities: () => void;
}) {
  const opportunityId = useOpportunityId();

  const { opportunity, isLoading, refreshOpportunity } =
    useFetchAdminOpportunity(opportunityId, fetchOpportunities);

  if (!opportunityId || !opportunity) {
    return <OpportunityDetails isLoading={isLoading} />;
  }

  return (
    <OpportunityDetails
      details={
        <AdminOpportunityDetails
          opportunity={opportunity}
          oppRefreshCallback={() => {
            refreshOpportunity();
          }}
          fetchOpportunities={fetchOpportunities}
        />
      }
      isLoading={isLoading}
    />
  );
}
