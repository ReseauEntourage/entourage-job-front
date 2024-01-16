import styled from 'styled-components';
import { COLORS, HEIGHTS } from 'src/constants/styles';

export const StyledNavbar = styled.nav`
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.05);
  background-color: ${ backgroundColor => COLORS[backgroundColor] || COLORS.black};
  color: ${color => COLORS[color] || COLORS.black};
  position: ${sticky => sticky ? 'fixed' : 'inherit'};
  top: 0;
  display: flex;
  width: 100%;
  z-index: 1040;
  height: ${HEIGHTS.HEADER}px;
`;

export const StyledCenterContainer = styled.div`
  display: flex;
  align-items: center;
  &:not(:only-child) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: -moz-max-content;
    width: max-content;
    box-sizing: border-box;
    z-index: 990;
  }
`;
export const StyledRightContainer = styled.div`
  flex-wrap: wrap;
  margin-left: auto;
  display: flex;
  align-items: center;
`;

export const StyledLeftContainer = styled.div`
  display: flex;
  align-items: center;
`;
