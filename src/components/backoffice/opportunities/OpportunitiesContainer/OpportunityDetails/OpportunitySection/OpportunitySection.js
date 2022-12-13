import React from 'react';
import PropTypes from 'prop-types';
import {
  DescriptionText,
  SubtitleText,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesContainer.styles';
import {
  Container,
  ContentContainer,
  TitleContainer,
} from './OpportunitySection.styles';

const OpportunitySection = ({ title, content }) => {
  return (
    <Container>
      <TitleContainer>
        <SubtitleText>{title}</SubtitleText>
      </TitleContainer>
      <ContentContainer>
        <DescriptionText>{content}</DescriptionText>
      </ContentContainer>
    </Container>
  );
};
OpportunitySection.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default OpportunitySection;
