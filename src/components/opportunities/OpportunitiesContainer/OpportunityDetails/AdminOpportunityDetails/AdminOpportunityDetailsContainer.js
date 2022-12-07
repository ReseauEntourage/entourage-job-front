import React from 'react';
import { useFetchOpportunity } from 'src/components/opportunities/OpportunitiesContainer/OpportunityDetails/useFetchOpportunity';
import { useOpportunityId } from 'src/components/opportunities/OpportunitiesContainer/useOpportunityId';
import PropTypes from 'prop-types';
import OpportunityDetails from '../OpportunityDetails';
import AdminOpportunityDetails from './AdminOpportunityDetails';

const AdminOpportunityDetailsContainer = ({ fetchOpportunities }) => {
  const opportunityId = useOpportunityId();
  const { opportunity, isLoading } = useFetchOpportunity(opportunityId);

  if (!opportunityId) {
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
