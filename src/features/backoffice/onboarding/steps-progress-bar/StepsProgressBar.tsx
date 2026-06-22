import { useOnboarding } from '@/src/features/backoffice/onboarding/useOnboarding';
import { WizardProgressBar } from '@/src/features/wizard-shell/WizardProgressBar';

export const StepsProgressBar = () => {
  const { onboardingSteps, currentOnboardingIdx } = useOnboarding();

  if (currentOnboardingIdx === null) {
    return null;
  }

  return (
    <WizardProgressBar
      steps={onboardingSteps}
      currentIdx={currentOnboardingIdx}
    />
  );
};
