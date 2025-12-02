import React from 'react';
import { Card } from 'src/components/utils';
import { StyledSequencesContainer } from './EventSequences.styles';
import { Item } from './Item';

export interface EventSequencesProps {
  sequences?: string[];
}

export const EventSequences = ({ sequences }: EventSequencesProps) => {
  if (!sequences || sequences.length === 0) {
    return null;
  }
  return (
    <Card title="A quoi s'attendre ?">
      <StyledSequencesContainer>
        {sequences.map((sequence, index) => (
          <Item key={index} sequence={sequence} idx={index} />
        ))}
      </StyledSequencesContainer>
    </Card>
  );
};
