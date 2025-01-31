import React, { type JSX } from 'react';
import { OverlayLoader } from 'src/components/utils/OverlayLoader';
import { StyledListContainer } from './OpportunitiesList.styles';

export const OpportunitiesList = React.memo(
  ({
    isLoading,
    list,
    noContent,
  }: {
    isLoading: boolean;
    list: JSX.Element | null;
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
