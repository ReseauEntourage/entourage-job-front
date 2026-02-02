import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledBackToTop = styled.button`
  height: 54px;
  z-index: 1000;
  width: 54px;
  position: fixed;
  right: 18px;
  bottom: 18px;
  background-color: ${COLORS.primaryBlue};
  border-radius: 90px;
  display: none;
  opacity: 0;
  transition: 0.1s ease-in-out;
  border: 0.5px solid ${COLORS.primaryBlue};
  &.visible {
    display: block;
    opacity: 1;
  }
  svg {
    color: white;
    transition: 0.1s ease-in-out;
  }
  &:hover {
    background-color: ${COLORS.hoverBlue};
    cursor: pointer;
    svg {
      color: ${COLORS.primaryBlue};
    }
  }
`;
