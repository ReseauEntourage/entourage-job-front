import React from 'react';
import {
  StyledContainer,
  StyledRightContainer,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesContainer.styles';
import { OpportunitiesContainerProps } from './OpportunitiesContainer.types';
import { OpportunitiesList } from './OpportunitiesList';

export const OpportunitiesContainerDesktop = ({
  list,
  details,
  isLoading,
  noContent,
}: OpportunitiesContainerProps) => {
  return (
    <StyledContainer>
      <OpportunitiesList
        isLoading={isLoading}
        list={list}
        noContent={noContent}
      />
      <StyledRightContainer>{details}</StyledRightContainer>
    </StyledContainer>
  );
};
