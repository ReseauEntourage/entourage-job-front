import React from 'react';
import { OverlayLoader } from 'src/components/utils/OverlayLoader';
import { StyledListContainer } from './OpportunitiesList.styles';

export const OpportunitiesList = React.memo(
  ({
    isLoading,
    list,
    noContent,
  }: {
    isLoading: boolean;
    list: JSX.Element;
    noContent: React.ReactNode;
  }) => {
    return (
      <StyledListContainer>
        {!list && isLoading && <OverlayLoader />}
        {!list && !isLoading && noContent}
        {list}
      </StyledListContainer>
    );
  }
);
