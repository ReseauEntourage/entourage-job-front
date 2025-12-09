import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';

export const StyledOffCanvas = styled.div<{
  isOpen: boolean;
  position: 'left' | 'right';
}>`
  position: fixed;
  top: 0;
  bottom: 0;
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  ${(props) => (props.position === 'left' ? 'left: 0;' : 'right: 0;')}
  z-index: 1040;
  width: 270px;
  background-color: ${COLORS.navBlack};
  padding: 20px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    width: 100%;
  }
`;

export const StyledCloseButtonContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;
