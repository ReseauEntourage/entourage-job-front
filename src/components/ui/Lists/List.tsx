import React from 'react';
import { StyledList } from './Lists.styles';

interface ListProps {
  children: React.ReactNode;
}

export const List = ({ children }: ListProps) => {
  return <StyledList>{children}</StyledList>;
};
