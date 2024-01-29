import React from 'react';
import styled from 'styled-components';
import { OverlayLoader } from 'src/components/utils/OverlayLoader';

export const StyledLoadingScreen = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LoadingScreen = () => {
  return (
    <StyledLoadingScreen>
      <OverlayLoader />
    </StyledLoadingScreen>
  );
};
