import React from 'react';
import { StyledContainerMarginY } from '../Containers.styles';

export const ContainerMarginY = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <StyledContainerMarginY>{children}</StyledContainerMarginY>;
};
