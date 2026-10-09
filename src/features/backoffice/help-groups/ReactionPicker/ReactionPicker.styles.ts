import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS, SHADOWS } from '@/src/constants/styles';

export const StyledReactionPicker = styled.div`
  position: relative;
  display: inline-flex;
`;

export const StyledReactionToggle = styled.button`
  padding: 4px 10px;
  border: 1px solid ${COLORS.gray};
  border-radius: 16px;
  background-color: ${COLORS.white};
  font-size: 14px;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: ${COLORS.primaryBlue};
  }

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`;

export const StyledReactionPalette = styled.div`
  position: absolute;
  bottom: calc(100% + 6px);
  left: 0;
  z-index: 10;
  display: flex;
  gap: 4px;
  padding: 6px;
  border: 1px solid ${COLORS.gray};
  border-radius: 20px;
  background-color: ${COLORS.white};
  box-shadow: ${SHADOWS.popover};
`;

export const StyledReactionOption = styled.button<{ $isActive: boolean }>`
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background-color: ${({ $isActive }) =>
    $isActive ? COLORS.hoverBlue : COLORS.transparent};
  font-size: 20px;
  cursor: pointer;

  &:hover {
    background-color: ${COLORS.hoverBlue};
  }
`;

// Palette displayed inline under the original message: on the right of the
// reactions summary on desktop, full width below the desktop breakpoint
export const StyledInlineReactionPalette = styled.div`
  display: flex;
  gap: 4px;
  margin-left: auto;
  padding: 4px;
  border-radius: 20px;
  background-color: ${COLORS.lightGray};

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    flex: 1 1 100%;
    justify-content: space-between;
    margin-left: 0;
    border-radius: 22px;
  }
`;

export const StyledInlineReactionOption = styled.button<{
  $isActive: boolean;
}>`
  width: 40px;
  height: 36px;
  border: none;
  border-radius: 18px;
  background-color: ${({ $isActive }) =>
    $isActive ? COLORS.extraLightTeal : COLORS.transparent};
  font-size: 18px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: ${COLORS.extraLightTeal};
  }

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    width: 56px;
    height: 40px;
    border-radius: 20px;
  }
`;
