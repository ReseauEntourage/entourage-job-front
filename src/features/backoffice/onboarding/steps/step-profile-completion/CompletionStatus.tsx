import React from 'react';
import { Text } from '@/src/components/ui/Text';
import { StyledCompletionStatus } from './CompletionStatus.styles';

export interface CompletionStatusProps {
  completion: number;
}

export const CompletionStatus = ({ completion }: CompletionStatusProps) => {
  return (
    <StyledCompletionStatus>
      <Text weight="semibold" textAlign="right">
        Profil complété à{' '}
      </Text>
      <Text size="large" color="primaryBlue" weight="bold" textAlign="right">
        {completion}%
      </Text>
    </StyledCompletionStatus>
  );
};
