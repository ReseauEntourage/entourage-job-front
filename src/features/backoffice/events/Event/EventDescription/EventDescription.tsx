import React from 'react';
import { Card, Text } from '@/src/components/ui';
import { StyledDescriptionContainer } from './EventDescription.styles';

export interface EventDescriptionProps {
  description?: string;
}

export const EventDescription = ({ description }: EventDescriptionProps) => {
  if (!description) {
    return null;
  }

  return (
    <Card title="Description">
      <StyledDescriptionContainer>
        <Text>{description}</Text>
      </StyledDescriptionContainer>
    </Card>
  );
};
