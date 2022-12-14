import React from 'react';
import { OverlayLoader } from 'src/components/utils/OverlayLoader';
import {
  Container,
  ContentContainer,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/OpportunityDetails.styles';
import PropTypes from 'prop-types';

const OpportunityDetails = ({ isLoading, details }) => {
  return (
    <Container
      onScroll={(event) => {
        console.log('DETAILS SCROLL', event);
      }}
    >
      <ContentContainer>
        {details}
        {isLoading && <OverlayLoader />}
      </ContentContainer>
    </Container>
  );
};

OpportunityDetails.defaultProps = {
  details: null,
  isLoading: false,
};

OpportunityDetails.propTypes = {
  details: PropTypes.element,
  isLoading: PropTypes.bool,
};

export default OpportunityDetails;
