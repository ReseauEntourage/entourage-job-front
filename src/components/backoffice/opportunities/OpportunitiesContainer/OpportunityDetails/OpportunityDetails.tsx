import React from 'react';
import {
  StyledContainer,
  StyledContentContainer,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/OpportunityDetails.styles';
import { OverlayLoader } from 'src/components/utils/OverlayLoader';

const OpportunityDetails = ({
  isLoading,
  details,
}: {
  isLoading?: boolean;
  details?: JSX.Element;
}) => {
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

export default OpportunityDetails;
