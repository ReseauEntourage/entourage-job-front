import React from 'react';
import { OverlayLoader } from 'src/components/utils/OverlayLoader';
import {
  StyledContainer,
  StyledContentContainer,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/OpportunityDetails.styles';
import PropTypes from 'prop-types';

const OpportunityDetails = ({ isLoading, details }) => {
  return (
    <StyledContainer>
      <StyledContentContainer>
        {details}
        {isLoading && <OverlayLoader />}
      </StyledContentContainer>
    </StyledContainer>
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
