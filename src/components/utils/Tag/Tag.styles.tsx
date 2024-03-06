import styled, { css } from 'styled-components';
import { COLORS } from 'src/constants/styles';

const styleVariants = {
  default: css`
    background-color: ${COLORS.hoverBlue};
    border-color: ${COLORS.hoverBlue};
    color: ${COLORS.primaryBlue};
  `,
  secondary: css`
    background-color: ${COLORS.primaryBlue};
    border-color: ${COLORS.primaryBlue};
    color: ${COLORS.white};
  `,
};

const sizeVariants = {
  default: css`
    padding: 3px 10px;
    font-size: 14px;
  `,
  small: css`
    padding: 0 8px;
    font-size: 12px;
  `,
};

export const StyledTag = styled.div`
  display: inline-flex;
  padding: 3px 10px;
  border-radius: 30px;
  border: 1px solid;
  font-weight: 400;
  overflow-wrap: normal;
  ${({ customStyle }) => styleVariants[customStyle]}
  ${({ size }) => sizeVariants[size]}
`;
