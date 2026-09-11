import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';

const GRID_GAP = 20;
const BADGE_SIZE = 32;

export const StyledCoachHowItWorks = styled.div`
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
`;

export const StyledStepIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70px;
`;

export const StyledStepBadge = styled.div<{ $isLast: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${BADGE_SIZE}px;
  height: ${BADGE_SIZE}px;
  border-radius: 50%;
  background: ${COLORS.primaryBlue};
  color: ${COLORS.white};
  font-weight: 900;

  ${({ $isLast }) =>
    !$isLast &&
    `
    @media (min-width: ${BREAKPOINTS.desktop}px) {
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 100%;
        width: ${GRID_GAP}px;
        height: 2px;
        background: ${COLORS.blueShade1};
        transform: translateY(-50%);
      }
    }
  `}
`;
