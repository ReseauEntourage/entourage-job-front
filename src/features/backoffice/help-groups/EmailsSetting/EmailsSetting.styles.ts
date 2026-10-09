import { css, styled } from 'styled-components';
import { BREAKPOINTS, COLORS, SHADOWS } from '@/src/constants/styles';

export const StyledEmailsSetting = styled.section<{ $isHighlighted: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 24px;
  border-radius: 10px;
  background-color: ${COLORS.white};
  box-shadow: ${SHADOWS.card};
  transition:
    background-color 0.4s,
    box-shadow 0.4s;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    gap: 8px;
    padding: 16px;
  }

  ${({ $isHighlighted }) =>
    $isHighlighted &&
    css`
      background-color: ${COLORS.hoverBlue};
      box-shadow: 0 0 0 2px ${COLORS.primaryBlue};
    `}
`;

export const StyledEmailsSettingHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;
