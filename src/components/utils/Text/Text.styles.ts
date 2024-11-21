import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';
import { TextProps } from './Text.types';

const sizes: { [K in NonNullable<TextProps['size']>]: number } = {
  small: 12,
  normal: 14,
  large: 16,
};

const colors: { [K in NonNullable<TextProps['color']>]: string } = {
  white: COLORS.white,
  lighter: COLORS.mediumGray,
  light: COLORS.darkGray,
  normal: COLORS.black,
  blue: COLORS.primaryBlue,
  lightRed: COLORS.lightRed,
};

export const StyledText = styled.div<TextProps>`
  padding: 0;
  margin: 0;
  font-weight: ${({ weight }) => weight};
  font-size: ${({ size }) => sizes[size]}px;
  line-height: ${({ size }) => sizes[size] * 1.5}px;
  color: ${({ color }) => colors[color]};
  font-style: ${({ variant }) => variant};
  text-align: ${({ center }) => (center ? 'center' : 'left')};
`;
