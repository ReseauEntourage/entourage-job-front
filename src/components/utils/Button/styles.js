import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledButton = styled.button`
  font-size: 14px;

  &.custom-secondary {
    padding: 6px 15px;
    background-color: white;
    border: 0.5px solid ${COLORS.primaryOrange};
    color: ${COLORS.primaryOrange} !important;
    border-radius: 25px;
    &:hover {
      cursor: pointer;
      background-color: ${COLORS.hoverOrange};
    }
  }
`;
