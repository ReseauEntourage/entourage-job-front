import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';


export const StyledProgrammesList = styled.ul`
  color: ${COLORS.black};
  padding: 5px 0;
  li {
    list-style: none;
    margin-bottom: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
    svg {
      min-width: 35px;
      margin-right: 10px;
      rect {
        fill: ${COLORS.primaryOrange};
      }
    }
  }
  &.mobile {
    padding: 5px 0;
    li {
      margin-bottom: 10px;
    }
  }
`;

