import styled, { css } from 'styled-components';
import { COLORS } from 'src/constants/styles';
import { TagSize, TagVariant } from './Tag';

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
  hoverBlue: css`
    background-color: ${COLORS.hoverBlue};
    border-color: ${COLORS.hoverBlue};
    color: ${COLORS.primaryBlue};
  `,
  darkBlue: css`
    background-color: ${COLORS.darkBlue};
    border-color: ${COLORS.darkBlue};
    color: ${COLORS.white};
  `,
  extraDarkBlue: css`
    background-color: ${COLORS.extraDarkBlue};
    border-color: ${COLORS.extraDarkBlue};
    color: ${COLORS.white};
  `,
  primaryBlue: css`
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
  large: css`
    padding: 6px 14px;
    font-size: 16px;
  `,
};

export const StyledTag = styled.div<{
  size: TagSize;
  variant: TagVariant;
}>`
  display: inline-flex;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 30px;
  border: 1px solid;
  font-weight: 400;
  overflow-wrap: normal;
  ${({ variant }) => styleVariants[variant]}
  ${({ size }) => sizeVariants[size]}
`;
