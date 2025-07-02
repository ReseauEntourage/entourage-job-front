import React from 'react';
import { Api } from '@/src/api';
import { Text } from 'src/components/utils';
import {
  StyledHeader,
  StyledProfileCompletion,
  StyledProgression,
  StyledProgressionContainer,
} from './ProfileCompletion.style';

export const ProfileCompletion = () => {
  const completionRate = Api.getProfileCompletion() || 0;

  return (
    <StyledProfileCompletion>
      <StyledHeader>
        <Text size="small" color="mediumGray">
          Votre profil
        </Text>
        <Text size="small" color="mediumGray">
          {`${completionRate}%`}
        </Text>
      </StyledHeader>
      <StyledProgressionContainer>
        <StyledProgression completionRate={completionRate} />
      </StyledProgressionContainer>
    </StyledProfileCompletion>
  );
};
