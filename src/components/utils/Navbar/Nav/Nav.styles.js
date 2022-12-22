import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledNav = styled.ul`
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const StyledNavItem = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  /* 2 */
  box-sizing: border-box;
  min-height: 80px;
  font-size: 0.875rem;
  font-family: Poppins, sans-serif;
  text-decoration: none;
  transition: 0.1s ease-in-out;
  transition-property: color, background-color, opacity;

  &:not(:first-child)::before {
    content: '|';
    align-items: center;
    margin: 0 20px;
    font-size: 14px;
    color: ${({ color }) => {
      return COLORS[color] || COLORS.white;
    }};
    opacity: 0.5;
    display: flex;
  }

  & a {
    padding: 0 15px;

    color: ${({ color }) => {
      return COLORS[color] || COLORS.white;
    }};
  }

  & a:hover {
    opacity: 0.5;
  }
`;
