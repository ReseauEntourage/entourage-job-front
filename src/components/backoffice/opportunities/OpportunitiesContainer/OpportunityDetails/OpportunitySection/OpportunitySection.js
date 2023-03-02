import React from 'react';
import PropTypes from 'prop-types';
import {
  DescriptionText,
  SubtitleText,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesContainer.styles';
import {
  StyledContainer,
  StyledContentContainer,
  StyledTitleContainer,
} from './OpportunitySection.styles';

const OpportunitySection = ({ title, content }) => {
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
OpportunitySection.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default OpportunitySection;
