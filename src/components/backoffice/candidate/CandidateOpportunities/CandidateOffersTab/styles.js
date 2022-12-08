import styled from 'styled-components';
import { COLORS } from 'src/constants/styles'

export const StyledTabsUl = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0;
  li {
    list-style: none;
    width: 20%;
    text-align: center;
    a {
      color: ${COLORS.darkGray};
    }
    &.active {
      a {
        color: ${COLORS.primaryOrange};
      }
    }
  }
`;
