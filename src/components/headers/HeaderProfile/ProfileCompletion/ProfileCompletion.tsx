import React from 'react';
import { Text } from 'src/components/utils';
import {
  StyledHeader,
  StyledProfileCompletion,
  StyledProgression,
  StyledProgressionContainer,
} from './ProfileCompletion.style';

export interface CompletionProgressBarProps {
  completionRate: number;
}

export const ProfileCompletion = ({
  completionRate,
}: CompletionProgressBarProps) => {
  return (
    <StyledProfileCompletion>
      <StyledHeader>
        <Text size="small" color="mediumGray">
          Votre profil
        </Text>
        <Text size="small" color="mediumGray">
          {completionRate * 100}%
        </Text>
      </StyledHeader>
      <StyledProgressionContainer>
        <StyledProgression completionRate={completionRate} />
      </StyledProgressionContainer>
    </StyledProfileCompletion>
  );
};
