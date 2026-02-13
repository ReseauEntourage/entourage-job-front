import React from 'react';
import { Spinner } from '../Spinner';
import { StyledSpinnerContainer } from './OverlayLoader.styles';

export function OverlayLoader() {
  return (
    <StyledSpinnerContainer>
      <Spinner />
    </StyledSpinnerContainer>
  );
}
