import React from 'react';
import { Text } from '@/src/components/ui/Text/Text';
import { Color } from '@/src/constants/styles';
import {
  StyledItem,
  StyledItemCounter,
  StyledItemCounterContainer,
} from './TimeLineHorizontal.styles';

export interface ItemProps {
  number: number;
  content: string;
  isLast?: boolean;
  active?: boolean;
  activeColor?: Color;
}

export const Item = ({
  number,
  content,
  isLast = false,
  active = false,
  activeColor = 'darkBlue',
}: ItemProps) => {
  return (
    <StyledItem isLast={isLast} active={active}>
      {/* Counter */}
      <StyledItemCounterContainer>
        <StyledItemCounter active={active} activeColor={activeColor}>
          <Text
            weight={active ? 'semibold' : 'normal'}
            size={20}
            color={active ? 'black' : 'gray'}
          >
            {number}
          </Text>
        </StyledItemCounter>

        {/* Content */}
        <Text
          size="large"
          weight={active ? 'semibold' : 'normal'}
          color={active ? 'black' : 'gray'}
        >
          {content}
        </Text>
      </StyledItemCounterContainer>
    </StyledItem>
  );
};
