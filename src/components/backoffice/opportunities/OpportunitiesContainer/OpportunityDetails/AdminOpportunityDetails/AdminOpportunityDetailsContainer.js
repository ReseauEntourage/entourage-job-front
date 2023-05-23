import React from 'react';
import { useFetchOpportunity } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/useFetchOpportunity.ts';
import { useOpportunityId } from 'src/components/backoffice/opportunities/useOpportunityId.ts';
import PropTypes from 'prop-types';
import OpportunityDetails from '../OpportunityDetails.tsx';
import AdminOpportunityDetails from './AdminOpportunityDetails';

const AdminOpportunityDetailsContainer = ({ fetchOpportunities }) => {
  const opportunityId = useOpportunityId();
  const { opportunity, isLoading } = useFetchOpportunity(opportunityId);

  if (!opportunityId || !opportunity) {
    return <OpportunityDetails isLoading={isLoading} />;
  }

  return (
    <OpportunityDetails
      details={
        <AdminOpportunityDetails
          opportunity={opportunity}
          fetchOpportunities={fetchOpportunities}
        />
      }
      isLoading={isLoading}
    />
  );
};

AdminOpportunityDetailsContainer.propTypes = {
  fetchOpportunities: PropTypes.func.isRequired,
};

export default AdminOpportunityDetailsContainer;
