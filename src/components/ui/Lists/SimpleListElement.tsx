import React from 'react';
import { StyledLi } from '@/src/components/ui/Lists/Lists.styles';

export const SimpleListElement = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <StyledLi>{children}</StyledLi>;
};
