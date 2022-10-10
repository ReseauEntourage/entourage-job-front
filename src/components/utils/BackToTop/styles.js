import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledBackToTop = styled.button`
  height: 54px;
  width: 54px;
  position: fixed;
  right: 18px;
  bottom: 18px;
  background-color: ${COLORS.primaryOrange};
  border-radius: 90px;
  display: none;
  opacity: 0;
  transition: 0.1s ease-in-out;
  border: 0.5px solid ${COLORS.primaryOrange};
  &.visible {
    display: block;
    opacity: 1;
  }
  span {
    color: white;
    transition: 0.1s ease-in-out;
  }
  &:hover {
    background-color: ${COLORS.hoverOrange};
    cursor: pointer;
    span {
      color: ${COLORS.primaryOrange};
    }
  }
`;
