import React from 'react';
import { StyledContainer } from './TimeLineHorizontal.styles';

export interface ContainerProps {
  children: React.ReactNode;
}

export const Container = ({ children }: ContainerProps) => {
  return <StyledContainer>{children}</StyledContainer>;
};
