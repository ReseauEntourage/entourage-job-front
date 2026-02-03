import { TimeLineHorizontal } from '@/src/components/ui/TimeLines/TimeLineHorizontal';
import { useOnboarding } from '@/src/features/backoffice/onboarding/useOnboarding';

export const StepsProgressBar = () => {
  const { onboardingSteps, currentOnboardingIdx } = useOnboarding();

  if (currentOnboardingIdx === null) {
    return null;
  }

  const BADGE_SIZE = 50;

  return (
    <TimeLineHorizontal.Container>
      <TimeLineHorizontal.Line badgeSize={BADGE_SIZE} />
      <TimeLineHorizontal.ItemGroup>
        {onboardingSteps.map((step, index) => (
          <TimeLineHorizontal.Item
            key={index}
            number={index + 1}
            isLast={index === onboardingSteps.length - 1}
            active={currentOnboardingIdx > index}
            content={step.smallTitle}
            badgeSize={BADGE_SIZE}
            duration={step.summary.duration}
          />
        ))}
      </TimeLineHorizontal.ItemGroup>
    </TimeLineHorizontal.Container>
  );
};
