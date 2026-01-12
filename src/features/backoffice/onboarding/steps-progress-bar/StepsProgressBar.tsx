import { TimeLineHorizontal } from '@/src/components/ui/TimeLines/TimeLineHorizontal';
import { useOnboarding } from '@/src/hooks/useOnboarding';

export const StepsProgressBar = () => {
  const { onboardingSteps, currentOnboardingIdx } = useOnboarding();

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
