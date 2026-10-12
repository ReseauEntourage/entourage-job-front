import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';

const StyledBaseButton = styled.button`
  width: 100%;
  border: 2px dashed ${COLORS.gray};
  border-radius: 8px;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s;

  &:hover {
    border-color: ${COLORS.primaryBlue};
    background: ${COLORS.primaryBlue}15;
  }

  &:focus-visible {
    outline: 2px solid ${COLORS.primaryBlue};
    outline-offset: 2px;
  }
`;

export const StyledEmptyCard = styled(StyledBaseButton)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 32px;
  text-align: left;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    flex-direction: column;
    justify-content: center;
    text-align: center;
    padding: 24px 16px;
  }
`;

export const StyledInlineRow = styled(StyledBaseButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
`;

export const StyledIconCircle = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${COLORS.primaryBlue}15;
`;

export const StyledTexts = styled.span`
  display: flex;
  flex-direction: column;
  gap: 4px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    align-items: center;
  }
`;
