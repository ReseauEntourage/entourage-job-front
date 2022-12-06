import React from 'react';
import { OverlayLoader } from 'src/components/utils/OverlayLoader';
import {
  Container,
  ContentContainer,
  Scroll,
} from 'src/components/opportunities/OpportunitiesContainer/OpportunityDetails/OpportunityDetails.styles';
import { useFetchOpportunity } from 'src/components/opportunities/OpportunitiesContainer/OpportunityDetails/useFetchOpportunity';
import PropTypes from 'prop-types';

const OpportunityDetails = ({ opportunityId }) => {
  const { currentOpportunity, isLoading } = useFetchOpportunity(opportunityId);

  return (
    <Container>
      <Scroll>
        {currentOpportunity && (
          <ContentContainer>
            {isLoading ? <OverlayLoader /> : <>{currentOpportunity.title}</>}
          </ContentContainer>
        )}
      </Scroll>
    </Container>
  );
};

OpportunityDetails.defaultProps = {
  opportunityId: null,
};

OpportunityDetails.propTypes = {
  opportunityId: PropTypes.string,
};

export default OpportunityDetails;
