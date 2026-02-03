import { useMemo } from 'react';
import { Text, Card } from '@/src/components/ui';
import { RoundBadge } from '@/src/components/ui/Badge/RoundBadge/RoundBadge';
import { H3 } from '@/src/components/ui/Headings';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useOnboarding } from '../../onboarding/useOnboarding';
import { useElearning } from '../useElearning';
import {
  StyledElearningProgressBar,
  StyledElearningProgressTracker,
  StyledElearningProgressTrackerContent,
} from './ElearningProgressTracker.styles';

/**
 * Component displaying the e-learning progress tracker with completion rate.
 * If we are in an onboarding step, it shows the step title and description.
 * Else it shows default e-learning Progress Tracker titles.
 */
export const ElearningProgressTracker = () => {
  const user = useAuthenticatedUser();
  const { currentOnboardingStep } = useOnboarding();
  const { completionRate } = useElearning();

  const title = useMemo(() => {
    return currentOnboardingStep?.title || 'Votre parcours de formation';
  }, [currentOnboardingStep]);

  const description = useMemo(() => {
    return (
      currentOnboardingStep?.description ||
      `Suivez ces modules pour rejoindre notre communauté de ${user.role.toLowerCase()}s bienveillants.`
    );
  }, [currentOnboardingStep, user.role]);
  return (
    <StyledElearningProgressTracker>
      <Card>
        <StyledElearningProgressTrackerContent>
          <div>
            <H3 title={title} />
            <Text>{description}</Text>
          </div>
          <StyledElearningProgressBar>
            <Text size="large" color="black" weight="semibold">
              Votre progression
            </Text>
            <RoundBadge
              size={75}
              textColor="black"
              borderColor="darkBlue"
              bgColor="transparent"
              borderSize={5}
              active
            >
              {completionRate}%
            </RoundBadge>
            <Text size="large" color="black">
              complété
            </Text>
          </StyledElearningProgressBar>
        </StyledElearningProgressTrackerContent>
      </Card>
    </StyledElearningProgressTracker>
  );
};
