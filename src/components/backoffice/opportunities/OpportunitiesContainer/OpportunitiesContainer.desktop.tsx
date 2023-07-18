import React from 'react';
import {
  StyledContainer,
  StyledRightContainer,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesContainer.styles';
import { OverlayLoader } from 'src/components/utils/OverlayLoader';
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
      {!list && isLoading && <OverlayLoader />}
      {!list && !isLoading && noContent}
      {list && (
        <>
          <OpportunitiesList isLoading={isLoading} list={list} />
          <StyledRightContainer>{details}</StyledRightContainer>
        </>
      )}
    </StyledContainer>
  );
};
