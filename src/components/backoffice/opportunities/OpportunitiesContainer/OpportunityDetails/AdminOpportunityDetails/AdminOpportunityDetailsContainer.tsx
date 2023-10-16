import React from 'react'
import { useOpportunityId } from '../../../useOpportunityId';
import { useFetchAdminOpportunity } from '../useFetchOpportunity';
import { OpportunityDetails } from '../OpportunityDetails';
import { AdminOpportunityDetails } from './AdminOpportunityDetails';
import { adminOffersTags } from 'src/constants';

export default function AdminOpportunityDetailsContainer({fetchOpportunities, currentTag}: {fetchOpportunities: () => void; currentTag: {value: adminOffersTags; label: string;}}) {
    const opportunityId = useOpportunityId();

    const { opportunity, isLoading, refreshOpportunity } = useFetchAdminOpportunity(
        opportunityId,
        fetchOpportunities,
      );
    
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
              currentTag={currentTag}
            />
          }
          isLoading={isLoading}
        />
      );
}
