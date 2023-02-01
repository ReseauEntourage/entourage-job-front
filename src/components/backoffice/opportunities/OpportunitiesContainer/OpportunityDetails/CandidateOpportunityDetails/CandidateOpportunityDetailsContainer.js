import React, { useContext } from 'react';
import { useFetchOpportunity } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/useFetchOpportunity';
import { useOpportunityId } from 'src/components/backoffice/opportunities/useOpportunityId';
import PropTypes from 'prop-types';
import { UserContext } from 'src/components/store/UserProvider';
import { getCandidateIdFromCoachOrCandidate } from 'src/utils';
import CandidateOpportunityDetails from './CandidateOpportunityDetails';
import OpportunityDetails from '../OpportunityDetails';

const CandidateOpportunityDetailsContainer = ({ fetchOpportunities }) => {
  const opportunityId = useOpportunityId();
  const { user } = useContext(UserContext);
  const candidateId = getCandidateIdFromCoachOrCandidate(user);

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
