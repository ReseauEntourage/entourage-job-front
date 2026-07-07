import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ProfileRecommendation } from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';
import { ElearningGateModal } from '@/src/features/modals/ElearningGateModal/ElearningGateModal';
import { openModal } from '@/src/features/modals/Modal/openModal';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { Api } from 'src/api';
import { useEmbeddingStatus } from 'src/hooks/useEmbeddingStatus';
import { Content, MatchRecapPanelState } from './Content/Content';

interface MatchRecapContainerProps {
  userRole: UserRoles | undefined;
  onOnboardingCompleted: (skipDashboardRedirect?: boolean) => Promise<void>;
}

// Ce composant n'est monté que lorsque le wizard atteint réellement l'étape
// récap : l'utilisateur est donc déjà authentifié (contrairement au hook de
// step, appelé sans condition à chaque rendu de useWizard).
export const MatchRecapContainer = ({
  userRole,
  onOnboardingCompleted,
}: MatchRecapContainerProps) => {
  const router = useRouter();
  const currentUser = useAuthenticatedUser();

  const [panelState, setPanelState] = useState<MatchRecapPanelState>('LOADING');
  const [recommendation, setRecommendation] =
    useState<ProfileRecommendation | null>(null);
  const hasCompletedRef = useRef(false);

  const fetchReco = useCallback(async () => {
    try {
      const { data } = await Api.getProfilesRecommendations({ limit: 1 });
      if (data.embeddingPending) {
        setPanelState('EMBEDDING_PENDING');
        return;
      }

      const topRecommendation: ProfileRecommendation | null =
        data.recommendations?.[0] ?? null;

      if (!topRecommendation) {
        setRecommendation(null);
        setPanelState('READY');
        return;
      }

      // La liste de recommandations n'expose pas experiences/formations :
      // on les récupère via le profil complet pour le seul profil mis en avant.
      try {
        const { data: fullProfile } = await Api.getPublicUserProfile(
          topRecommendation.publicProfile.id
        );
        setRecommendation({
          ...topRecommendation,
          publicProfile: {
            ...topRecommendation.publicProfile,
            experiences: fullProfile.experiences ?? [],
            formations: fullProfile.formations ?? [],
          },
        });
      } catch {
        setRecommendation(topRecommendation);
      }
      setPanelState('READY');
    } catch {
      setRecommendation(null);
      setPanelState('READY');
    }
  }, []);

  const handleEmbeddingReady = useCallback(() => {
    setPanelState('COMPUTING_RECO');
    fetchReco();
  }, [fetchReco]);

  useEmbeddingStatus({
    onReady: handleEmbeddingReady,
    enabled: panelState === 'EMBEDDING_PENDING',
  });

  useEffect(() => {
    fetchReco();
  }, [fetchReco]);

  // Complète l'onboarding une seule fois. skipDashboardRedirect est utilisé
  // lorsque ce composant gère lui-même la navigation suivante (CTA messagerie/annuaire),
  // pour éviter que la redirection dashboard générique ne l'écrase.
  const completeOnboarding = useCallback(
    (skipDashboardRedirect = false) => {
      if (hasCompletedRef.current) {
        return;
      }
      hasCompletedRef.current = true;
      void onOnboardingCompleted(skipDashboardRedirect);
    },
    [onOnboardingCompleted]
  );

  useEffect(() => {
    if (panelState === 'READY' && !recommendation) {
      completeOnboarding();
    }
  }, [panelState, recommendation, completeOnboarding]);

  const handlePrimaryCta = useCallback(() => {
    if (!recommendation) {
      return;
    }
    completeOnboarding(true);
    if (!currentUser.elearningCompletedAt) {
      openModal(<ElearningGateModal />);
      return;
    }
    router.push(
      `/backoffice/messaging?userId=${recommendation.publicProfile.id}`
    );
  }, [recommendation, completeOnboarding, currentUser, router]);

  const handleSecondaryCta = useCallback(() => {
    completeOnboarding(true);
    const oppositeRole =
      userRole === UserRoles.CANDIDATE ? UserRoles.COACH : UserRoles.CANDIDATE;
    router.push(
      `/backoffice/annuaire?entity=user&sort=relevance&role=${oppositeRole}`
    );
  }, [completeOnboarding, userRole, router]);

  return (
    <Content
      panelState={panelState}
      recommendation={recommendation}
      userRole={userRole}
      onSkipWait={() => completeOnboarding()}
      onPrimaryCta={handlePrimaryCta}
      onSecondaryCta={handleSecondaryCta}
    />
  );
};
