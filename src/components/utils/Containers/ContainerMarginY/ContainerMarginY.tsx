import React from 'react';
import { StyledContainerMarginY } from '../Containers.styles';

interface ContainerMarginYProps {
  children: React.ReactNode;
  margin?: string;
}

export const ContainerMarginY = ({
  children,
  margin,
}: ContainerMarginYProps) => {
  return (
    <StyledContainerMarginY margin={margin}>{children}</StyledContainerMarginY>
  );
};
