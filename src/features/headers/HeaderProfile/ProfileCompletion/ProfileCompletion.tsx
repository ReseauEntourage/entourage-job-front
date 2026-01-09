import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text } from '@/src/components/ui';
import { selectOnboardingCurrentStep } from '@/src/use-cases/onboarding';
import {
  profileCompletionActions,
  selectProfileCompletionRate,
} from 'src/use-cases/profile-completion';
import {
  StyledHeader,
  StyledProfileCompletion,
  StyledProgression,
  StyledProgressionContainer,
} from './ProfileCompletion.style';

export const ProfileCompletion = () => {
  const dispatch = useDispatch();
  const completionRate = useSelector(selectProfileCompletionRate);
  const onbordingCurrentStep = useSelector(selectOnboardingCurrentStep);

  useEffect(() => {
    if (onbordingCurrentStep === 0) {
      dispatch(profileCompletionActions.fetchProfileCompletionRequested());
    }
  }, [dispatch, onbordingCurrentStep]);

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
