import React from 'react';
import { StyledContainer } from './TimeLineHorizontal.styles';

interface ContainerProps {
  children: React.ReactNode;
}

export const Container = ({ children }: ContainerProps) => {
  return <StyledContainer>{children}</StyledContainer>;
};
