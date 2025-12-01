import React from 'react';
import { Text } from 'src/components/utils';
import {
  StyledContent,
  StyledIconContainer,
  StyledItemContainer,
} from './Item.styles';

export interface ItemProps {
  icon?: React.ReactNode;
  title: string;
  content: string;
}

export const Item = ({ icon, title, content }: ItemProps) => {
  return (
    <StyledItemContainer>
      <StyledIconContainer>{icon}</StyledIconContainer>
      <StyledContent>
        <Text weight="semibold">{title}</Text>
        <Text>{content}</Text>
      </StyledContent>
    </StyledItemContainer>
  );
};
