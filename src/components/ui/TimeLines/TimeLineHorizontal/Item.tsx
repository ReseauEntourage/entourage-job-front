import React from 'react';
import { Text } from '@/src/components/ui/Text/Text';
import { Color } from '@/src/constants/styles';
import { NumberCheckableBadge } from '../../Badge/NumberCheckableBadge/NumberCheckableBadge';
import {
  StyledItem,
  StyledItemCounterContainer,
} from './TimeLineHorizontal.styles';

export interface ItemProps {
  number: number;
  content: string;
  isLast?: boolean;
  active?: boolean;
  activeColor?: Color;
  badgeSize?: number;
}

export const Item = ({
  number,
  content,
  isLast = false,
  active = false,
  activeColor,
  badgeSize = 50,
}: ItemProps) => {
  return (
    <StyledItem isLast={isLast} active={active}>
      {/* Counter */}
      <StyledItemCounterContainer>
        <NumberCheckableBadge
          number={number}
          active={active}
          borderColor={activeColor}
          checked={active}
          size={badgeSize}
        />

        {/* Content */}
        <Text
          size="large"
          weight={active ? 'semibold' : 'normal'}
          color={active ? 'black' : 'darkGray'}
          center
        >
          {content}
        </Text>
      </StyledItemCounterContainer>
    </StyledItem>
  );
};
