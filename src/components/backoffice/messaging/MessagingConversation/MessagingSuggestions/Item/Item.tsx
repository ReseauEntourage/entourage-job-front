import React from 'react';
import { MessagingSuggestionItem } from '../MessagingSuggestions.types';
import { Text } from 'src/components/utils';
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
