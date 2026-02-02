import React from 'react';
import { StyledContainer } from '@/src/components/ui/Container/Container.styles';

export const Container = ({ children }: { children: React.ReactNode }) => {
  return <StyledContainer>{children}</StyledContainer>;
};
