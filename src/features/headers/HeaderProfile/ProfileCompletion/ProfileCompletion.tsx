import React from 'react';
import { useSelector } from 'react-redux';
import { Text } from '@/src/components/ui';
import { selectOnboardingCurrentStep } from '@/src/use-cases/onboardingOld';
import { useGetProfileCompletionQuery } from '@/src/use-cases/profile-completion';
import {
  StyledHeader,
  StyledProfileCompletion,
  StyledProgression,
  StyledProgressionContainer,
} from './ProfileCompletion.style';

export const ProfileCompletion = () => {
  const onbordingCurrentStep = useSelector(selectOnboardingCurrentStep);
  const { data: completionRate = 0 } = useGetProfileCompletionQuery(undefined, {
    skip: onbordingCurrentStep !== 0,
  });

  return (
    <StyledProfileCompletion>
      <StyledHeader>
        <Text size="small" color="mediumGray">
          Complétion du profil
        </Text>
        <Text size="small" color="mediumGray">
          {`${completionRate}%`}
        </Text>
      </StyledHeader>
      <StyledProgressionContainer>
        <StyledProgression $completionRate={completionRate} />
      </StyledProgressionContainer>
    </StyledProfileCompletion>
  );
};
