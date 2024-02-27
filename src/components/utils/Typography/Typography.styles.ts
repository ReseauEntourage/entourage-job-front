import React from 'react';
import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export interface TypographyProps {
  children: React.ReactNode;
  size?: 'small' | 'normal' | 'large';
  weight?: 'normal' | 'bold';
  color?: 'lighter' | 'light' | 'normal';
  variant?: 'normal' | 'italic';
}

const sizes: { [K in NonNullable<TypographyProps['size']>]: number } = {
  small: 12,
  normal: 14,
  large: 16,
};

const colors: { [K in NonNullable<TypographyProps['color']>]: string } = {
  lighter: COLORS.darkGray,
  light: COLORS.darkGrayFont,
  normal: COLORS.black,
};

export const StyledTypography = styled.div<TypographyProps>`
  padding: 0;
  margin: 0;
  font-weight: ${({ weight }) => weight};
  font-size: ${({ size }) => sizes[size]}px;
  line-height: ${({ size }) => sizes[size] * 1.5}px;
  color: ${({ color }) => colors[color]};
  font-style: ${({ variant }) => variant};
`;
