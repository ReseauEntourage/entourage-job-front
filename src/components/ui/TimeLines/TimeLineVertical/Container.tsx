import React from 'react';
import { StyledContainer } from './TimeLineVertical.styles';

export interface ContainerProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Container = ({ children, style }: ContainerProps) => {
  return <StyledContainer style={style}>{children}</StyledContainer>;
};
