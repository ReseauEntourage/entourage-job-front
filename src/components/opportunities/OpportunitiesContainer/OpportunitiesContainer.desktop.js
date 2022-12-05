import React from 'react';
import { Container } from 'src/components/opportunities/OpportunitiesContainer/OpportunitiesContainer.styles';
import OpportunitiesList from 'src/components/opportunities/OpportunitiesContainer/OpportunitiesList';
import { useOpportunityId } from 'src/components/opportunities/OpportunitiesContainer/useOpportunityId';
import PropTypes from 'prop-types';
import NoOpportunities from 'src/components/opportunities/OpportunitiesContainer/NoOpportunities';
import OpportunityDetails from 'src/components/opportunities/OpportunitiesContainer/OpportunityDetails';

export function OpportunitiesContainerDesktop({
  opportunities,
  isLoading,
  status,
}) {
  const opportunityId = useOpportunityId();

  return (
    <Container>
      {opportunities ? (
        <>
          <OpportunitiesList
            isLoading={isLoading}
            opportunities={opportunities}
          />
          <OpportunityDetails opportunityId={opportunityId} />
        </>
      ) : (
        <NoOpportunities status={status} />
      )}
    </Container>
  );
}

OpportunitiesContainerDesktop.defaultProps = {
  opportunities: null,
};

OpportunitiesContainerDesktop.propTypes = {
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
