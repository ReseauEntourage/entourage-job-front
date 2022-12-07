import React, { useContext } from 'react';
import { useFetchOpportunity } from 'src/components/opportunities/OpportunitiesContainer/OpportunityDetails/useFetchOpportunity';
import { useOpportunityId } from 'src/components/opportunities/OpportunitiesContainer/useOpportunityId';
import PropTypes from 'prop-types';
import { UserContext } from 'src/components/store/UserProvider';
import { getCandidateIdFromCoachOrCandidate } from 'src/utils';
import CandidateOpportunityDetails from './CandidateOpportunityDetails';
import OpportunityDetails from '../OpportunityDetails';

const CandidateOpportunityDetailsContainer = ({ fetchOpportunities }) => {
  const opportunityId = useOpportunityId();
  const { user } = useContext(UserContext);
  const candidateId = getCandidateIdFromCoachOrCandidate(user);

  const { opportunity, isLoading } = useFetchOpportunity(
    opportunityId,
    candidateId
  );

  if (!opportunityId && !opportunity) {
    return <OpportunityDetails isLoading={isLoading} />;
  }

  return (
    <OpportunityDetails
      details={
        <CandidateOpportunityDetails
          opportunity={opportunity}
          fetchOpportunities={fetchOpportunities}
        />
      }
      isLoading={isLoading}
    />
  );
};

CandidateOpportunityDetailsContainer.propTypes = {
  fetchOpportunities: PropTypes.func.isRequired,
};

export default CandidateOpportunityDetailsContainer;
