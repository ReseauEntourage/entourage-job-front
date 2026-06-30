import styled from 'styled-components';
import { BREAKPOINTS, COLORS, HEIGHTS } from '@/src/constants/styles';

export const WIZARD_BOTTOM_SHEET_PILL_HEIGHT = 24;

export const StyledBottomSheet = styled.div<{
  $translateY: string;
  $isDragging: boolean;
}>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(100vh - ${HEIGHTS.HEADER_MOBILE}px);
  background: ${COLORS.white};
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(${({ $translateY }) => $translateY});
  transition: ${({ $isDragging }) =>
    $isDragging ? 'none' : 'transform 300ms ease'};
  z-index: 20;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (min-width: ${BREAKPOINTS.desktop + 1}px) {
    display: none;
  }
`;

export const StyledPillAnchor = styled.div`
  height: ${WIZARD_BOTTOM_SHEET_PILL_HEIGHT}px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  user-select: none;
`;

export const StyledPill = styled.div`
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: ${COLORS.gray};
`;

export const StyledBottomSheetContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;
