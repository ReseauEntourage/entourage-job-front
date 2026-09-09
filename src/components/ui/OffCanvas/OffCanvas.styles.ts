import { styled } from 'styled-components';
import { BREAKPOINTS, Color, COLORS } from '@/src/constants/styles';

export const StyledOffCanvas = styled.div<{
  $isOpen: boolean;
  $position: 'left' | 'right';
  $backgroundColor?: Color;
}>`
  position: fixed;
  top: 0;
  bottom: 0;
  display: ${(props) => (props.$isOpen ? 'block' : 'none')};
  ${(props) => (props.$position === 'left' ? 'left: 0;' : 'right: 0;')}
  z-index: 1040;
  width: 270px;
  background-color: ${(props) =>
    (props.$backgroundColor && COLORS[props.$backgroundColor]) ||
    COLORS.extraDarkGray};
  padding: 20px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    width: 100%;
  }
`;

export const StyledCloseButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;
