import { useOnboarding } from '@/src/features/backoffice/onboarding/useOnboarding';
import { WizardIndicator } from '@/src/features/wizard-shell/WizardIndicator';

export const StepsIndicator = () => {
  const { onboardingSteps, currentOnboardingIdx } = useOnboarding();

  if (currentOnboardingIdx === null) {
    return null;
  }

  return (
    <WizardIndicator
      totalSteps={onboardingSteps.length}
      currentIdx={currentOnboardingIdx}
    />
  );
};
