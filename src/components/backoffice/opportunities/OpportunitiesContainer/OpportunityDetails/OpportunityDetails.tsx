import React from 'react';
import {
  StyledContainer,
  StyledContentContainer,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/OpportunityDetails.styles';
import { OverlayLoader } from 'src/components/utils/OverlayLoader';

export const OpportunityDetails = ({
  isLoading = false,
  details,
}: {
  isLoading?: boolean;
  details?: React.ReactNode;
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
