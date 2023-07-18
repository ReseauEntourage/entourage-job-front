import React from 'react';
import { OverlayLoader } from 'src/components/utils/OverlayLoader';
import { StyledListContainer } from './OpportunitiesList.styles';

export const OpportunitiesList = React.memo(
  ({ isLoading, list }: { isLoading: boolean; list: JSX.Element }) => {
    return (
      <StyledListContainer>
        {list}
        {isLoading && <OverlayLoader />}
      </StyledListContainer>
    );
  }
);
