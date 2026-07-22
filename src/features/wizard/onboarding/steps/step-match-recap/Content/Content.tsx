import { ProfileRecommendation } from '@/src/api/types';
import { Button } from '@/src/components/ui';
import { H2 } from '@/src/components/ui/Headings';
import { UserRoles } from '@/src/constants/users';
import { RecapSuggestedMessage } from '@/src/features/backoffice/messaging/RecapSuggestedMessage/RecapSuggestedMessage';
import {
  SEARCHING_LOADER_VARIANTS,
  WizardSearchingLoader,
} from '@/src/features/wizard/components/WizardSearchingLoader';
import { WizardCompatibleProfileCard } from '@/src/features/wizard/sidepanels/WizardCompatibleProfileCard';
import { StyledOnboardingStepContainer } from '../../../onboarding.styles';
import { StyledMatchRecapActions } from './Content.styles';

export type MatchRecapPanelState =
  | 'LOADING'
  | 'EMBEDDING_PENDING'
  | 'COMPUTING_RECO'
  | 'READY';

interface ContentProps {
  panelState: MatchRecapPanelState;
  recommendation: ProfileRecommendation | null;
  userRole: UserRoles | undefined;
  isEligibleToContact: boolean;
  onSkipWait: () => void;
  onPrimaryCta: () => void;
  onSendSuggestedMessage: () => void;
  onSecondaryCta: () => void;
}

export const Content = ({
  panelState,
  recommendation,
  userRole,
  isEligibleToContact,
  onSkipWait,
  onPrimaryCta,
  onSendSuggestedMessage,
  onSecondaryCta,
}: ContentProps) => {
  const isCandidate = userRole === UserRoles.CANDIDATE;

  if (panelState !== 'READY') {
    return (
      <StyledOnboardingStepContainer>
        <WizardSearchingLoader
          {...SEARCHING_LOADER_VARIANTS[
            panelState === 'EMBEDDING_PENDING'
              ? 'embeddingPending'
              : 'computingReco'
          ]}
        />
        <StyledMatchRecapActions>
          <Button onClick={onSkipWait} variant="text">
            Passer l&apos;attente
          </Button>
        </StyledMatchRecapActions>
      </StyledOnboardingStepContainer>
    );
  }

  if (!recommendation) {
    return null;
  }

  const profile = recommendation.publicProfile;

  return (
    <StyledOnboardingStepContainer>
      <H2
        title={
          isEligibleToContact
            ? isCandidate
              ? 'Félicitations ! Vous pouvez dès à présent contacter des coachs'
              : 'Félicitations ! Vous pouvez dès à présent contacter des candidats'
            : isCandidate
            ? 'Félicitations ! Vous pouvez dès à présent consulter le profil de votre coach'
            : 'Félicitations ! Vous pouvez dès à présent consulter le profil de votre candidat'
        }
        center
      />
      <WizardCompatibleProfileCard
        profile={profile}
        variant="full"
        badgeLabel={
          isCandidate
            ? 'Meilleur coach pour démarrer'
            : 'Meilleur candidat pour démarrer'
        }
      />
      <StyledMatchRecapActions>
        {isEligibleToContact ? (
          <RecapSuggestedMessage
            recommendation={recommendation}
            onSend={onSendSuggestedMessage}
          />
        ) : (
          <Button
            dataTestId="wizard-match-recap-primary-cta"
            onClick={onPrimaryCta}
            variant="primary"
            size="large"
          >
            {`Voir le profil de ${profile.firstName}`}
          </Button>
        )}
        <Button
          dataTestId="wizard-match-recap-secondary-cta"
          onClick={onSecondaryCta}
          variant="text"
        >
          {isCandidate ? 'Voir les autres coachs' : 'Voir les autres candidats'}
        </Button>
      </StyledMatchRecapActions>
    </StyledOnboardingStepContainer>
  );
};
