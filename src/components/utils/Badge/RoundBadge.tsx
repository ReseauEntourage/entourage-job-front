import React from 'react';
import { Color } from '@/src/constants/styles';
import { StyledRoundBadge } from './RoundBadge.styles';

export interface RoundBadgeProps {
  children?: React.ReactNode;
  color: Color;
}

export const RoundBadge = ({ children, color }: RoundBadgeProps) => {
  return <StyledRoundBadge color={color}>{children}</StyledRoundBadge>;
};
