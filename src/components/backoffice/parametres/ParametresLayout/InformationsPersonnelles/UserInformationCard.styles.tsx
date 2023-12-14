import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledInformationsPersonnelles = styled.ul`
  padding-left: 0;
  li {
    list-style: none;
    &:not(:last-child) {
      margin-bottom: 30px;
    }
    svg {
      margin-right: 10px;
      color: ${COLORS.primaryOrange};
    }
  }
`;
