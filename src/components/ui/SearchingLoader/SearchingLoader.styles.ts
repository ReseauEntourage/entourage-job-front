import styled, { css, keyframes, Keyframes } from 'styled-components';
import { COLORS } from 'src/constants/styles';

const CARD_W = 48;
const CARD_H = 56;
const GRID_GAP = 8;

export const TIME_PER_CARD = 0.6;

const PRIMARY_BLUE_RGB = '71, 168, 185';

// Moving shimmer gradient for skeleton state
const shimmer = keyframes`
  from { background-position: -${CARD_W * 2}px 0; }
  to   { background-position:  ${CARD_W * 2}px 0; }
`;

// Card i (0-indexed) reveals at ((i+1)/(total+1)) of the cycle — natural start/end pause
export const generateSkeletonFadeOut = (
  idx: number,
  total: number
): Keyframes => {
  const activatePct = ((idx + 1) / (total + 1)) * 100;
  const fadePct = Math.min(activatePct + 5, 100);
  return keyframes`
    0%                    { opacity: 1; }
    ${activatePct.toFixed(1)}% { opacity: 1; }
    ${fadePct.toFixed(1)}%     { opacity: 0; }
    100%                  { opacity: 0; }
  `;
};

export const generateIconReveal = (idx: number, total: number): Keyframes => {
  const activatePct = ((idx + 1) / (total + 1)) * 100;
  const fadePct = Math.min(activatePct + 5, 100);
  return keyframes`
    0%                    { opacity: 0; transform: scale(0.7); }
    ${activatePct.toFixed(1)}% { opacity: 0; transform: scale(0.7); }
    ${fadePct.toFixed(1)}%     { opacity: 1; transform: scale(1);   }
    100%                  { opacity: 1; transform: scale(1);   }
  `;
};

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 16px 0;
`;

export const StyledCardGrid = styled.div<{ $cols: number; $rows: number }>`
  position: relative;
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols}, ${CARD_W}px);
  grid-template-rows: repeat(${({ $rows }) => $rows}, ${CARD_H}px);
  gap: ${GRID_GAP}px;
`;

export const StyledCard = styled.div<{
  $idx: number;
  $total: number;
  $cycle: number;
  $theme: 'dark' | 'light';
}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid
    ${({ $theme }) =>
      $theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'};
  background: ${({ $theme }) =>
    $theme === 'dark' ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.04)'};
  color: ${({ $theme }) =>
    $theme === 'dark'
      ? 'rgba(255, 255, 255, 0.75)'
      : `rgba(${PRIMARY_BLUE_RGB}, 0.9)`};

  > * {
    position: relative;
    z-index: 1;
    ${({ $idx, $total, $cycle }) => css`
      animation: ${generateIconReveal($idx, $total)} ${$cycle}s linear infinite;
    `}
  }

  /* Skeleton shimmer overlay */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: ${({ $theme }) =>
      $theme === 'dark'
        ? `linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.03) 100%)`
        : `linear-gradient(90deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.07) 50%, rgba(0,0,0,0.02) 100%)`};
    background-size: ${CARD_W * 3}px 100%;
    pointer-events: none;
    ${({ $idx, $total, $cycle }) => css`
      animation: ${shimmer} 1.4s ease-in-out infinite,
        ${generateSkeletonFadeOut($idx, $total)} ${$cycle}s linear infinite;
    `}
  }
`;

export const StyledTitles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
`;

export const StyledTitle = styled.p<{ $theme: 'dark' | 'light' }>`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: ${({ $theme }) =>
    $theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : COLORS.extraDarkGray};
`;

export const StyledSubtitle = styled.p<{ $theme: 'dark' | 'light' }>`
  margin: 0;
  font-size: 12px;
  color: ${({ $theme }) =>
    $theme === 'dark' ? 'rgba(255, 255, 255, 0.55)' : COLORS.mediumGray};
`;
