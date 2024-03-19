import React from 'react';
import { StyledList } from './Lists.styles';

interface ListProps {
  children: React.ReactNode;
  animated?: boolean;
}

export const List = ({ children, animated }: ListProps) => {
  return (
    <StyledList
      data-uk-scrollspy={
        animated
          ? 'cls:uk-animation-slide-bottom; target: > li; delay: 200;'
          : ''
      }
    >
      {children}
    </StyledList>
  );
};
