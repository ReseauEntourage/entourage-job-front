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
  return (
    <StyledElearningProgressTracker>
      <Card>
        <StyledElearningProgressTrackerContent>
          <div>
            <H3 title="Votre parcours de formation" />
            <Text>
              {`Suivez ces modules pour rejoindre notre communauté de ${user.role.toLowerCase()}s bienveillants Entourage Pro.`}
            </Text>
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
