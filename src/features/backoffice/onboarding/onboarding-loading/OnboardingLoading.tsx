import React from 'react';
import { Text } from '@/src/components/ui';
import { H3 } from '@/src/components/ui/Headings';
import { Spinner } from '@/src/components/ui/Spinner';
import { StyledOnboardingLoadingContainer } from './OnboardingLoading.styles';

export const OnboardingLoading = () => {
  return (
    <StyledOnboardingLoadingContainer>
      <Spinner size={64} />
      <H3 title="Veuillez patienter..." />
      <Text>Nous préparons votre parcours, pour bien démarrer.</Text>
    </StyledOnboardingLoadingContainer>
  );
};
