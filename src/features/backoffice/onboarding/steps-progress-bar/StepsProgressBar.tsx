import { TimeLineHorizontal } from '@/src/components/ui/TimeLines/TimeLineHorizontal';
import { useOnboarding } from '@/src/features/backoffice/onboarding/useOnboarding';

export const StepsProgressBar = () => {
  const { onboardingSteps, currentOnboardingIdx } = useOnboarding();

  if (currentOnboardingIdx === null) {
    return null;
  }

  return (
    <TimeLineHorizontal.Container>
      <TimeLineHorizontal.Line />
      <TimeLineHorizontal.ItemGroup>
        {onboardingSteps.map((step, index) => (
          <TimeLineHorizontal.Item
            key={index}
            number={index + 1}
            isLast={index === onboardingSteps.length - 1}
            active={currentOnboardingIdx >= index}
            content={step.smallTitle}
          />
        ))}
      </TimeLineHorizontal.ItemGroup>
    </TimeLineHorizontal.Container>
  );
};
