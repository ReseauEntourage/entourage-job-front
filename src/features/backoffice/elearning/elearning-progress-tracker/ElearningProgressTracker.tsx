import { Text, Card } from '@/src/components/ui';
import { RoundBadge } from '@/src/components/ui/Badge/RoundBadge/RoundBadge';
import { H3 } from '@/src/components/ui/Headings';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useElearning } from '../useElearning';
import {
  StyledElearningProgressBar,
  StyledElearningProgressTracker,
  StyledElearningProgressTrackerContent,
} from './ElearningProgressTracker.styles';

export const ElearningProgressTracker = () => {
  const user = useAuthenticatedUser();
  const { completionRate } = useElearning();

  const title = 'Votre parcours de formation';
  const description = `Suivez ces modules pour rejoindre notre communauté de ${user.role.toLowerCase()}s bienveillants.`;
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
