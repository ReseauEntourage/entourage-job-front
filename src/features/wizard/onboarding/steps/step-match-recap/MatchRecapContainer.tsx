import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ProfileRecommendation } from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';
import { useContactEligibility } from '@/src/hooks/useContactEligibility';
import { Api } from 'src/api';
import { useEmbeddingStatus } from 'src/hooks/useEmbeddingStatus';
import { Content, MatchRecapPanelState } from './Content/Content';

interface MatchRecapContainerProps {
  userRole: UserRoles | undefined;
  onOnboardingCompleted: (skipDashboardRedirect?: boolean) => Promise<void>;
  onSuggestedMessageSent: () => void;
}

// This component is only mounted once the wizard actually reaches the recap
// step: the user is therefore already authenticated (unlike the step hook,
// called unconditionally on every render of useWizard).
export const MatchRecapContainer = ({
  userRole,
  onOnboardingCompleted,
  onSuggestedMessageSent,
}: MatchRecapContainerProps) => {
  const router = useRouter();
  const { isEligibleToContact } = useContactEligibility();

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

      // The recommendations list doesn't expose experiences/formations:
      // fetch them via the full profile, only for the single featured profile.
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

  // Completes onboarding only once. skipDashboardRedirect is used when this
  // component handles the next navigation itself (messaging/directory CTA),
  // to prevent the generic dashboard redirect from overriding it.
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

  // Non-eligible case only: the eligible case shows the inline compose
  // (cf. RecapSuggestedMessage), which handles the send and redirect itself.
  const handlePrimaryCta = useCallback(() => {
    if (!recommendation) {
      return;
    }
    completeOnboarding(true);
    router.push(`/backoffice/profile/${recommendation.publicProfile.id}`);
  }, [recommendation, completeOnboarding, router]);

  const handleSendSuggestedMessage = useCallback(() => {
    completeOnboarding(true);
    // Arms the post-send redirect carried by useWizardRedirects: this
    // component will be unmounted before the send resolves (cf. comment
    // on pendingSuggestedMessageRedirectRef in useOnboardingPhase).
    onSuggestedMessageSent();
  }, [completeOnboarding, onSuggestedMessageSent]);

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
      isEligibleToContact={isEligibleToContact}
      onSkipWait={() => completeOnboarding()}
      onPrimaryCta={handlePrimaryCta}
      onSendSuggestedMessage={handleSendSuggestedMessage}
      onSecondaryCta={handleSecondaryCta}
    />
  );
};
