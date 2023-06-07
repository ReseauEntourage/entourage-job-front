import React from 'react';
import { StyledContainer } from 'src/components/utils/Container/Container.styles';

export const Container = ({ children }: { children: React.ReactNode }) => {
  return <StyledContainer>{children}</StyledContainer>;
};
