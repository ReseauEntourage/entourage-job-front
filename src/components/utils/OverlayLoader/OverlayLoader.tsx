import React from 'react';
import { StyledContainer } from './OverlayLoader.styles';

export function OverlayLoader() {
  return (
    <StyledContainer>
      <div data-uk-spinner="ratio: .8" />
    </StyledContainer>
  );
}
