import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';

const GRID_GAP = 20;
const BADGE_SIZE = 32;
const ICON_HEIGHT = 70;
const STEP_GAP = 12;
const CONNECTOR_TOP = ICON_HEIGHT + STEP_GAP + BADGE_SIZE / 2;

export const StyledCoachHowItWorks = styled.div`
  background: ${COLORS.hoverBlue};
  border-radius: 30px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
`;

export const StyledStepsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px ${GRID_GAP}px;
  width: 100%;
  margin-top: 40px;

  @media (min-width: ${BREAKPOINTS.desktop}px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const StyledStep = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${STEP_GAP}px;
  text-align: center;

  &:not(:last-child) {
    @media (min-width: ${BREAKPOINTS.desktop}px) {
      &::after {
        content: '';
        position: absolute;
        z-index: 0;
        top: ${CONNECTOR_TOP}px;
        left: 50%;
        width: calc(100% + ${GRID_GAP}px);
        height: 2px;
        background: ${COLORS.blueShade1};
      }
    }
  }
`;

export const StyledStepIcon = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${ICON_HEIGHT}px;
`;

export const StyledStepBadge = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${BADGE_SIZE}px;
  height: ${BADGE_SIZE}px;
  border-radius: 50%;
  background: ${COLORS.primaryBlue};
  color: ${COLORS.white};
  font-weight: 900;
`;
