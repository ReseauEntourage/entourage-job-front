import styled, { css } from 'styled-components';
import { COLORS } from 'src/constants/styles';

const variants = {
  default: css`
    background-color: ${COLORS.hoverOrange};
    border-color: ${COLORS.hoverOrange};
    color: ${COLORS.primaryOrange};
  `,
  secondary: css`
    background-color: ${COLORS.primaryOrange};
    border-color: ${COLORS.primaryOrange};
    color: ${COLORS.white};
  `,
};
export const StyledTag = styled.div`
  display: inline-flex;
  padding: 3px 10px;
  border-radius: 30px;
  border: 1px solid;
  font-size: 14px;
  font-weight: 400;
  ${({ customStyle }) => variants[customStyle]}
`;
