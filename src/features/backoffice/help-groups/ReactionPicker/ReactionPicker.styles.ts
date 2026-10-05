import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
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
