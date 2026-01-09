import React from 'react';
import { Text } from '@/src/components/ui';
import { MessagingSuggestionItem } from '../MessagingSuggestions.types';
import { ItemContainer } from './Item.styles';

export interface ItemProps {
  suggestion: MessagingSuggestionItem;
  onClick?: () => void;
}

export const Item = ({ suggestion, onClick }: ItemProps) => {
  return (
    <ItemContainer onClick={onClick}>
      <Text size="small">{suggestion.name}</Text>
    </ItemContainer>
  );
};
