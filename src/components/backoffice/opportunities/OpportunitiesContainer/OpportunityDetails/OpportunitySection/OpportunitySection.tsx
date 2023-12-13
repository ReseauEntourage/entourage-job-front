import React from 'react';
import {
  DescriptionText,
  SubtitleText,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesContainer.styles';
import {
  StyledContainer,
  StyledOpportunitySectionContentContainer,
  StyledOpportunitySectionTitleContainer,
} from './OpportunitySection.styles';

export const OpportunitySection = ({
  title,
  content,
}: {
  title: string;
  content: React.ReactNode;
}) => {
  return (
    <StyledContainer>
      <StyledOpportunitySectionTitleContainer>
        <SubtitleText>{title}</SubtitleText>
      </StyledOpportunitySectionTitleContainer>
      <StyledOpportunitySectionContentContainer>
        <DescriptionText>{content}</DescriptionText>
      </StyledOpportunitySectionContentContainer>
    </StyledContainer>
  );
};
