import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS, HEIGHTS } from '@/src/constants/styles';

export const StyledPublicNavCard = styled.nav`
  width: min(1314px, calc(100% - 32px));
  position: fixed;
  top: ${HEIGHTS.PUBLIC_NAV_OFFSET_TOP}px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1040;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 6px 24px;
  background-color: ${COLORS.white};
  border-radius: 35px;
  box-shadow: 0px 5px 20px 0px rgba(38, 125, 140, 0.85);

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    height: ${HEIGHTS.PUBLIC_NAV_CARD_MOBILE}px;
    padding: 0 16px;
  }
`;

export const StyledPublicNavItemsRow = styled.ul`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const StyledPublicNavActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StyledPublicItem = styled.div<{
  selected: boolean;
  $isMenu: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  height: 38px;
  padding: 0 16px;
  border-radius: 999px;
  font-family: Poppins, sans-serif;
  font-size: 12px;
  font-weight: ${({ selected }) => (selected ? '700' : '400')};
  color: ${({ selected }) => (selected ? COLORS.white : COLORS.extraDarkGray)};
  background-color: ${({ selected }) => (selected ? COLORS.primaryBlue : 'transparent')};
  transition:
    background-color 0.15s ease-in-out,
    color 0.15s ease-in-out;
  ${({ $isMenu }) => ($isMenu ? 'cursor: pointer;' : '')}

  a {
    color: inherit;
    font-weight: inherit;
    text-decoration: none;
  }
`;
