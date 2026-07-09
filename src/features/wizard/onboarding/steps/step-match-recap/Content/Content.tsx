import { ProfileRecommendation } from '@/src/api/types';
import { Button } from '@/src/components/ui';
import { H2 } from '@/src/components/ui/Headings';
import { UserRoles } from '@/src/constants/users';
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
  onSkipWait: () => void;
  onPrimaryCta: () => void;
  onSecondaryCta: () => void;
}

export const Content = ({
  panelState,
  recommendation,
  userRole,
  onSkipWait,
  onPrimaryCta,
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
          isCandidate
            ? 'Félicitations ! Vous pouvez dès à présent contacter des coachs'
            : 'Félicitations ! Vous pouvez dès à présent contacter des candidats'
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
        <Button
          dataTestId="wizard-match-recap-primary-cta"
          onClick={onPrimaryCta}
          variant="primary"
          size="large"
        >
          Écrire à {profile.firstName}
        </Button>
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
