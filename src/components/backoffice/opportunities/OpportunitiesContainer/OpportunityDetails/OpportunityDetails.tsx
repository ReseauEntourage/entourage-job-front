import React from 'react';
import { StyledNoResult } from 'src/components/backoffice/Backoffice.styles';
import { OverlayLoader } from 'src/components/utils/OverlayLoader';
import {
  StyledOpportunityDetailsContentContainer,
  StyledOpportunityDetailsVariableHeightContainer,
} from './OpportunityDetails.styles';

export const OpportunityDetails = ({
  isLoading = false,
  contentHeight,
  details,
}: {
  isLoading?: boolean;
  details?: React.ReactNode;
  contentHeight?: number;
}) => {
  return (
    <StyledOpportunityDetailsVariableHeightContainer
      contentHeight={contentHeight}
    >
      <StyledOpportunityDetailsContentContainer>
        {details || <StyledNoResult>Aucune offre sélectionnée</StyledNoResult>}
        {isLoading && <OverlayLoader />}
      </StyledOpportunityDetailsContentContainer>
    </StyledOpportunityDetailsVariableHeightContainer>
  );
};
