import React from 'react';
import { StyledImgProfileStackContainer } from './ImgProfileStack.styles';

export interface ImgProfileStackProps {
  children: React.ReactNode;
}

export const ImgProfileStack = ({ children }: ImgProfileStackProps) => {
  return (
    <StyledImgProfileStackContainer>{children}</StyledImgProfileStackContainer>
  );
};
