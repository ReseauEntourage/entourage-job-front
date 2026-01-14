import { LucidIcon, Text } from '@/src/components/ui';
import { useOnboarding } from '@/src/features/backoffice/onboarding/useOnboarding';
import { StyledIndicatorContainer } from './StepsIndicator.styles';

export const StepsIndicator = () => {
  const { onboardingSteps, currentOnboardingIdx } = useOnboarding();

  if (!currentOnboardingIdx) {
    return null;
  }

  return (
    <StyledIndicatorContainer>
      <LucidIcon name="Calendar" color="white" />
      <Text color="white">
        Étape {currentOnboardingIdx + 1} sur {onboardingSteps.length}
      </Text>
    </StyledIndicatorContainer>
  );
};
