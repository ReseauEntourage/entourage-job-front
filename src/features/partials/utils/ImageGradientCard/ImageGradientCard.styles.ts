import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledImageGradientCard = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 20px;
  overflow: hidden;
`;

export const StyledImageLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
`;

export const StyledGradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(20, 62, 76, 0) 0%,
    ${COLORS.photoOverlayBlue1} 45%,
    ${COLORS.photoOverlayBlue2} 75%,
    ${COLORS.photoOverlayBlue3} 100%
  );
`;

export const StyledTextLayer = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
  padding: 20px;
  color: ${COLORS.white};

  h1,
  h2,
  h3,
  h4 {
    margin: 0;
  }

  p {
    margin: 0;
  }
`;
