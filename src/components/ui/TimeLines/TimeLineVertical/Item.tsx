import React from 'react';
import { Text } from '@/src/components/ui/Text/Text';
import {
  StyledItem,
  StyledItemContent,
  StyledItemCounter,
  StyledItemCounterContainer,
  StyledItemCounterLinker,
} from './TimeLineVertical.styles';

export interface ItemProps {
  number: number;
  children: React.ReactNode;
  isLast?: boolean;
}

export const Item = ({ number, children, isLast = false }: ItemProps) => {
  return (
    <StyledItem>
      {/* Counter */}
      <StyledItemCounterContainer>
        <StyledItemCounter>
          <Text color="white" weight="semibold" size={20}>
            {number}
          </Text>
        </StyledItemCounter>
        {!isLast && <StyledItemCounterLinker />}
      </StyledItemCounterContainer>

      {/* Content */}
      <StyledItemContent>{children}</StyledItemContent>
    </StyledItem>
  );
};
