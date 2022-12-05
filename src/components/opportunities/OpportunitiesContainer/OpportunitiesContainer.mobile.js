import React from 'react';
import { Container } from 'src/components/opportunities/OpportunitiesContainer/OpportunitiesContainer.styles';
import { useOpportunityId } from 'src/components/opportunities/OpportunitiesContainer/useOpportunityId';
import PropTypes from 'prop-types';
import OpportunityDetails from 'src/components/opportunities/OpportunitiesContainer/OpportunityDetails';
import NoOpportunities from 'src/components/opportunities/OpportunitiesContainer/NoOpportunities';
import OpportunitiesList from 'src/components/opportunities/OpportunitiesContainer/OpportunitiesList';

const OpportunitiesContainerMobile = ({ opportunities, isLoading, status }) => {
  const opportunityId = useOpportunityId();

  return (
    <Container>
      {opportunities ? (
        <>
          {opportunityId ? (
            <OpportunityDetails opportunityId={opportunityId} />
          ) : (
            <OpportunitiesList
              isLoading={isLoading}
              opportunities={opportunities}
            />
          )}
        </>
      ) : (
        <NoOpportunities status={status} />
      )}
    </Container>
  );
};

OpportunitiesContainerMobile.defaultProps = {
  opportunities: null,
};

OpportunitiesContainerMobile.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  opportunities: PropTypes.arrayOf(PropTypes.element),
  status: PropTypes.oneOf([
    'à traiter',
    'consultée',
    "en phase d'entretien",
    'abandonnée',
    'acceptées',
  ]).isRequired,
};

export default OpportunitiesContainerMobile;
