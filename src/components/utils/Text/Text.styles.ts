import React from 'react';
import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export interface TextProps {
  children: React.ReactNode;
  size?: 'small' | 'normal' | 'large';
  weight?: 'normal' | 'bold';
  color?: 'lighter' | 'light' | 'normal';
}

const sizes: { [K in NonNullable<TextProps['size']>]: number } = {
  small: 12,
  normal: 15,
  large: 18,
};

const colors: { [K in NonNullable<TextProps['color']>]: string } = {
  lighter: COLORS.darkGray,
  light: COLORS.darkGrayFont,
  normal: COLORS.black,
};

export const StyledText = styled.p<TextProps>`
  padding: 0;
  margin: 0;
  font-weight: ${({ weight }) => weight};
  font-size: ${({ size }) => sizes[size]}px;
  line-height: ${({ size }) => sizes[size]}px;
  color: ${({ color }) => colors[color]};
`;
