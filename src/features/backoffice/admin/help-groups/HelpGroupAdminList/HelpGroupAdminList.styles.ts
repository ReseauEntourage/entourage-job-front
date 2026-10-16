import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';

export const StyledHelpGroupAdminTabs = styled.div`
  display: flex;
  gap: 8px;
  margin: 24px 0 20px;
  border-bottom: 1px solid ${COLORS.gray};

  @media (max-width: ${BREAKPOINTS.desktop - 1}px) {
    gap: 0;

    > * {
      flex: 1;
    }
  }
`;

export const StyledHelpGroupAdminTab = styled.button<{ $isActive: boolean }>`
  min-height: 48px;
  padding: 0 16px;
  border: none;
  background-color: ${COLORS.transparent};
  box-shadow: ${({ $isActive }) =>
    $isActive ? `inset 0 -3px 0 ${COLORS.primaryBlue}` : 'none'};
  color: ${({ $isActive }) => ($isActive ? COLORS.darkBlue : COLORS.darkGray)};
  font-family: inherit;
  font-size: 14px;
  font-weight: ${({ $isActive }) => ($isActive ? 600 : 400)};
  cursor: pointer;

  &:hover,
  &:focus-visible {
    color: ${COLORS.darkBlue};
  }
`;

export const StyledHelpGroupAdminTabCount = styled.span<{ $isActive: boolean }>`
  margin-left: 4px;
  padding: 1px 8px;
  border-radius: 10px;
  background-color: ${({ $isActive }) =>
    $isActive ? COLORS.hoverBlue : COLORS.extraLightGray};
  font-size: 12px;
`;

export const StyledHelpGroupAdminTabPanel = styled.div``;
