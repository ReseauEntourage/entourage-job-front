import React from 'react';
import { Color } from '@/src/constants/styles';
import { StyledDot } from './Dot.styles';

export interface DotProps {
  color: Color;
}

export const Dot = ({ color }: DotProps) => {
  return <StyledDot color={color}></StyledDot>;
};
