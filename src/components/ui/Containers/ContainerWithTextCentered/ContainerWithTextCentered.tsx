import React from 'react';
import { StyledContainerWithTextCentered } from '../Containers.styles';

export const ContainerWithTextCentered = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <StyledContainerWithTextCentered>
      {children}
    </StyledContainerWithTextCentered>
  );
};
