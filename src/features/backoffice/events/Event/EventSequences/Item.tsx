import React from 'react';
import { Text } from '@/src/components/ui';
import { StyledIndex, StyledItem } from './EventSequences.styles';

export interface ItemProps {
  sequence: string;
  idx: number;
}

export const Item = ({ sequence, idx }: ItemProps) => {
  return (
    <StyledItem>
      <StyledIndex>{idx + 1}</StyledIndex>
      <Text size="large">{sequence}</Text>
    </StyledItem>
  );
};
