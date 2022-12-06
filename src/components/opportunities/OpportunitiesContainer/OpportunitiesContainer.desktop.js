import React from 'react';
import {
  Container,
  RightContainer,
} from 'src/components/opportunities/OpportunitiesContainer/OpportunitiesContainer.styles';
import OpportunitiesList from 'src/components/opportunities/OpportunitiesContainer/OpportunitiesList';
import { useOpportunityId } from 'src/components/opportunities/OpportunitiesContainer/useOpportunityId';
import PropTypes from 'prop-types';
import NoOpportunities from 'src/components/opportunities/OpportunitiesContainer/NoOpportunities/NoOpportunities';
import OpportunityDetails from 'src/components/opportunities/OpportunitiesContainer/OpportunityDetails';

const OpportunitiesContainerDesktop = ({
  opportunities,
  isLoading,
  status,
}) => {
  const opportunityId = useOpportunityId();

  return (
    <Container>
      {opportunities ? (
        <>
          <OpportunitiesList
            isLoading={isLoading}
            opportunities={opportunities}
          />
          <RightContainer>
            <OpportunityDetails opportunityId={opportunityId} />
          </RightContainer>
        </>
      ) : (
        <NoOpportunities status={status} />
      )}
    </Container>
  );
};

OpportunitiesContainerDesktop.defaultProps = {
  opportunities: null,
};

OpportunitiesContainerDesktop.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  opportunities: PropTypes.element,
  status: PropTypes.oneOf([
    'à traiter',
    'consultée',
    "en phase d'entretien",
    'abandonnée',
    'acceptées',
  ]).isRequired,
};

export default OpportunitiesContainerDesktop;
