import { Button } from '@/src/components/ui';
import { H5 } from '@/src/components/ui/Headings';
import { Text } from '@/src/components/ui/Text/Text';
import { StyledOnboardingStepContainer } from '../../onboarding.styles';
import { StyledWebinarSelectionContainer } from './Content.styles';
import { WebinarSelection } from './WebinarSelection';

interface ContentProps {
  webinarSfId: string | null;
  onWebinarSfIdChange: (value: string) => void;
  onSkip: () => void;
  isSkipping: boolean;
}

export const Content = ({
  webinarSfId,
  onWebinarSfIdChange,
  onSkip,
  isSkipping,
}: ContentProps) => {
  return (
    <StyledOnboardingStepContainer>
      <StyledWebinarSelectionContainer>
        <H5 title="Venez à la réunion de bienvenue" noMarginBottom />
        <Text color="darkGray">
          Rencontrez l&apos;équipe, comprenez votre rôle et posez vos questions.
          Choisissez le créneau qui vous arrange&nbsp;!
        </Text>
        <br />
        <WebinarSelection
          webinarSfId={webinarSfId}
          onChange={onWebinarSfIdChange}
        />
      </StyledWebinarSelectionContainer>
      <Button variant="text" onClick={onSkip} disabled={isSkipping}>
        Plus tard
      </Button>
    </StyledOnboardingStepContainer>
  );
};
