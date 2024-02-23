import React from 'react';
import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export interface LabelProps {
  children: React.ReactNode;
  size?: 'small' | 'normal' | 'large';
  weight?: 'normal' | 'bold';
  color?: 'lighter' | 'light' | 'normal';
  variant?: 'normal' | 'italic';
}

const sizes: { [K in NonNullable<LabelProps['size']>]: number } = {
  small: 12,
  normal: 14,
  large: 16,
};

const colors: { [K in NonNullable<LabelProps['color']>]: string } = {
  lighter: COLORS.darkGray,
  light: COLORS.darkGrayFont,
  normal: COLORS.black,
};

export const StyledLabel = styled.span<LabelProps>`
  padding: 0;
  margin: 0;
  font-weight: ${({ weight }) => weight};
  font-size: ${({ size }) => sizes[size]}px;
  line-height: ${({ size }) => sizes[size] * 1.5}px;
  color: ${({ color }) => colors[color]};
  font-style: ${({ variant }) => variant};
`;
