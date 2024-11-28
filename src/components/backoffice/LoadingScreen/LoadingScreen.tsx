import React from 'react';
import styled from 'styled-components';
import { OverlayLoader } from 'src/components/utils/OverlayLoader';
import { HEIGHTS } from 'src/constants/styles';

export const StyledLoadingScreen = styled.div`
  width: 100%;
  height: calc(100vh - ${HEIGHTS.HEADER}px);
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
