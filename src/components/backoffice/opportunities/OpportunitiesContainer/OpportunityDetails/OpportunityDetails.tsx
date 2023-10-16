import React from 'react';
import {
  StyledOpportunityDetailsVariableHeightContainer,
  StyledOpportunityDetailsContentContainer,
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
    <StyledOpportunityDetailsVariableHeightContainer>
      <StyledOpportunityDetailsContentContainer>
        {details}
        {isLoading && <OverlayLoader />}
      </StyledOpportunityDetailsContentContainer>
    </StyledOpportunityDetailsVariableHeightContainer>
  );
};
