import React from 'react';
import { StyledCardListItem } from './CardListItem.styles';

interface CardListItemProps {
  children: React.ReactNode;
  dataTestId?: string;
}

export function CardListItem({ children, dataTestId }: CardListItemProps) {
  return (
    <StyledCardListItem data-testid={dataTestId}>{children}</StyledCardListItem>
  );
}
