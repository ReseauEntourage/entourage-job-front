import React from 'react';
import {
  DescriptionText,
  SubtitleText,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesContainer.styles';
import {
  StyledContainer,
  StyledContentContainer,
  StyledTitleContainer,
} from './OpportunitySection.styles';

export const OpportunitySection = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  return (
    <StyledContainer>
      <StyledTitleContainer>
        <SubtitleText>{title}</SubtitleText>
      </StyledTitleContainer>
      <StyledContentContainer>
        <DescriptionText>{content}</DescriptionText>
      </StyledContentContainer>
    </StyledContainer>
  );
};
