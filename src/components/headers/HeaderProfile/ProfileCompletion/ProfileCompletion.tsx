import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Api } from '@/src/api';
import { selectOnboardingCurrentStep } from '@/src/use-cases/onboarding';
import { Text } from 'src/components/utils';
import {
  StyledHeader,
  StyledProfileCompletion,
  StyledProgression,
  StyledProgressionContainer,
} from './ProfileCompletion.style';

export const ProfileCompletion = () => {
  // Utilisation d'un state local car on utilise le taux de completion seulement dans ce composant
  const [completionRate, setCompletionRate] = useState(0);
  const onbordingCurrentStep = useSelector(selectOnboardingCurrentStep);

  useEffect(() => {
    const fetchCompletionRate = async () => {
      const { data } = await Api.getProfileCompletion();
      setCompletionRate(data || 0);
    };

    if (onbordingCurrentStep === 0) {
      fetchCompletionRate();
    }
  }, [onbordingCurrentStep]);

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
