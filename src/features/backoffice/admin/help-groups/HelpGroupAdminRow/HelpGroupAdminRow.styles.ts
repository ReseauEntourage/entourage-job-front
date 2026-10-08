import { styled } from 'styled-components';
import { COLORS, SHADOWS } from '@/src/constants/styles';

export const StyledHelpGroupAdminActions = styled.div<{ $isCard?: boolean }>`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;

  /* Mobile card: the main action takes the remaining width */
  > button:first-child {
    flex: ${({ $isCard }) => ($isCard ? 1 : 'none')};
  }
`;

// Icon toggle of the « À la une » column
export const StyledHelpGroupPinToggle = styled.button<{ $isPinned: boolean }>`
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: ${({ $isPinned }) =>
    $isPinned ? COLORS.extraLightTeal : COLORS.transparent};
  color: ${({ $isPinned }) => ($isPinned ? COLORS.teal : COLORS.darkGray)};
  cursor: pointer;

  &:hover:not(:disabled),
  &:focus-visible {
    background-color: ${({ $isPinned }) =>
      $isPinned ? COLORS.extraLightTeal : COLORS.lightGray};
  }

  &:disabled {
    color: ${COLORS.gray};
    cursor: not-allowed;
  }
`;

export const StyledHelpGroupMenuToggle = styled.button<{
  $bordered?: boolean;
}>`
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: ${({ $bordered }) =>
    $bordered ? `1px solid ${COLORS.gray}` : 'none'};
  border-radius: ${({ $bordered }) => ($bordered ? '5px' : '50%')};
  background-color: ${COLORS.transparent};
  color: ${COLORS.black};
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background-color: ${COLORS.extraLightGray};
  }
`;

export const StyledHelpGroupMenuItem = styled.span<{ $isDanger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ $isDanger }) => ($isDanger ? COLORS.warning : 'inherit')};
`;

export const StyledHelpGroupAdminCenter = styled.div`
  display: flex;
  justify-content: center;
`;

// Mobile: one card per group
export const StyledHelpGroupAdminCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 14px 14px 16px;
  border-radius: 10px;
  background-color: ${COLORS.white};
  box-shadow: ${SHADOWS.card};
`;

export const StyledHelpGroupAdminCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

export const StyledHelpGroupAdminCardTitle = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  min-width: 0;
`;
