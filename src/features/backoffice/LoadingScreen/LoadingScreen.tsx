import React from 'react';
import { OverlayLoader } from '@/src/components/ui/OverlayLoader';
import { StyledLoadingScreen } from './LoadingScreen.styles';

export const LoadingScreen = () => {
  return (
    <StyledLoadingScreen>
      <OverlayLoader />
    </StyledLoadingScreen>
  );
};
