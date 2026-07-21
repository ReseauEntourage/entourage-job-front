import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '@/src/api/types';
import { ReduxRequestEvents } from '@/src/constants';
import { UserRoles } from '@/src/constants/users';
import { RegistrationFlow } from '@/src/features/registration/flows/flows.types';
import { OnboardingStatus } from '@/src/features/wizard/onboarding/onboarding.constants';
import {
  buildOnboardingStepOrder,
  determineStartingStep,
} from '@/src/features/wizard/onboarding/onboarding.utils';
import { useOnboardingStepElearning } from '@/src/features/wizard/onboarding/steps/step-elearning/useOnboardingStepElearning';
import { useOnboardingStepMatchRecap } from '@/src/features/wizard/onboarding/steps/step-match-recap/useOnboardingStepMatchRecap';
import { ProfileMode } from '@/src/features/wizard/onboarding/steps/step-profile-completion/profile-steps/types';
import { useStepCvChoice } from '@/src/features/wizard/onboarding/steps/step-profile-completion/profile-steps/useStepCvChoice';
import { useStepCvLoading } from '@/src/features/wizard/onboarding/steps/step-profile-completion/profile-steps/useStepCvLoading';
import { useStepCvRecap } from '@/src/features/wizard/onboarding/steps/step-profile-completion/profile-steps/useStepCvRecap';
import { useStepExperiences } from '@/src/features/wizard/onboarding/steps/step-profile-completion/profile-steps/useStepExperiences';
import { useStepFormations } from '@/src/features/wizard/onboarding/steps/step-profile-completion/profile-steps/useStepFormations';
import { useStepPhoto } from '@/src/features/wizard/onboarding/steps/step-profile-completion/profile-steps/useStepPhoto';
import { useStepPresentation } from '@/src/features/wizard/onboarding/steps/step-profile-completion/profile-steps/useStepPresentation';
import { useStepSkills } from '@/src/features/wizard/onboarding/steps/step-profile-completion/profile-steps/useStepSkills';
import { useOnboardingStepSocialSituation } from '@/src/features/wizard/onboarding/steps/step-social-situation/useOnboardingStepSocialSituation';
import { useOnboardingStepWebinar } from '@/src/features/wizard/onboarding/steps/step-webinar/useOnboardingStepWebinar';
import {
  WizardStep,
  WizardStepId,
} from '@/src/features/wizard/shell/wizard.types';
import { useCurrentUserProfileComplete } from '@/src/hooks/current-user/useCurrentUserProfileComplete';
import { useProfileGeneration } from '@/src/hooks/useProfileGeneration';
import {
  currentUserActions,
  selectFetchCurrentProfileStatus,
  selectUpdateOnboardingStatusSelectors,
  uploadExternalCvSelectors,
} from '@/src/use-cases/current-user';
import { onboardingActions } from '@/src/use-cases/onboarding';

interface UseOnboardingPhaseParams {
  currentUser: User | null;
  registrationFlow: RegistrationFlow | null;
}

export interface OnboardingPhaseState {
  steps: WizardStep[];
  currentStepIdx: number | null;
  currentStep: WizardStep | null;
  isLoading: boolean;
  isInitializing: boolean;
  buttonLabel: string;
  onNext: () => Promise<void>;
  onBack: () => void;
  canGoBack: boolean;
  isAlreadyCompleted: boolean;
  updateOnboardingStatus: ReturnType<
    typeof selectUpdateOnboardingStatusSelectors.selectUpdateOnboardingStatusStatus
  >;
  skipDashboardRedirectRef: React.MutableRefObject<boolean>;
  pendingSuggestedMessageRedirectRef: React.MutableRefObject<boolean>;
  skipOnboarding: () => void;
}

export const useOnboardingPhase = ({
  currentUser,
  registrationFlow,
}: UseOnboardingPhaseParams): OnboardingPhaseState => {
  const dispatch = useDispatch();

  const fetchProfileStatus = useSelector(selectFetchCurrentProfileStatus);
  const updateOnboardingStatus = useSelector(
    selectUpdateOnboardingStatusSelectors.selectUpdateOnboardingStatusStatus
  );

  // ─── Profile mode ────────────────────────────────────────────────────────────

  const [profileMode, setProfileMode] = useState<ProfileMode>('pending');
  const [currentOnboardingStepId, setCurrentOnboardingStepId] =
    useState<WizardStepId | null>(null);
  const [onboardingIsLoading, setOnboardingIsLoading] = useState(false);

  const profileComplete = useCurrentUserProfileComplete();
  const { generateProfileFromCV, cancelProfileGeneration } =
    useProfileGeneration();
  const hasTriggeredGenerationRef = useRef(false);

  // Switches to manual entry from cv-loading after the wait delay: cancels
  // the in-progress generation job before advancing.
  const handleCvGenerationManualFallback = useCallback(() => {
    void cancelProfileGeneration();
    setProfileMode('manual');
  }, [cancelProfileGeneration]);

  // Initializes profileMode from server data on load
  const [isProfileModeInitialized, setIsProfileModeInitialized] =
    useState(false);
  useEffect(() => {
    if (isProfileModeInitialized) {
      return;
    }
    if (!profileComplete) {
      return;
    }

    setIsProfileModeInitialized(true);

    if (profileComplete.hasExternalCv) {
      setProfileMode('cv');
    } else if (
      (profileComplete.experiences?.length ?? 0) > 0 ||
      (profileComplete.formations?.length ?? 0) > 0
    ) {
      setProfileMode('manual');
    }
    // else remains 'pending' — user hasn't started any path yet
  }, [profileComplete, isProfileModeInitialized]);

  // The backend sets onboardingStatus === COMPLETED as soon as the account is
  // created for Association and Entreprise-admin: these roles have no
  // candidate/coach onboarding.
  const isOnboardingAlreadyCompleted =
    currentUser?.onboardingStatus === OnboardingStatus.COMPLETED;

  // Before the account is created (currentUser still null), the selected
  // registration flow is already enough to know onboarding will be skipped
  // (Association/Entreprise): prevents the default steps (photo/elearning/
  // webinar, tagged profile/formation) from making these sections appear in
  // the stepper during registration.
  const isEarlyOnboardingCompletionFlow =
    registrationFlow === RegistrationFlow.REFERER ||
    registrationFlow === RegistrationFlow.COMPANY;

  const shouldSkipOnboardingSteps =
    isOnboardingAlreadyCompleted ||
    (!currentUser && isEarlyOnboardingCompletionFlow);

  // ─── Centralized advancement ──────────────────────────────────────────────────
  // requestAdvance is the single advancement point for onboarding steps: a
  // step can only move the engine forward from itself (stepId must be the
  // current step), which prevents a delayed advance (e.g. a fetch resolving
  // after a step change) from shifting the displayed step.
  const onboardingStepsRef = useRef<WizardStep[]>([]);
  const requestAdvance = useCallback((stepId: WizardStepId) => {
    setCurrentOnboardingStepId((prev) => {
      if (prev !== stepId) {
        return prev;
      }
      const steps = onboardingStepsRef.current;
      const idx = steps.findIndex((step) => step.id === stepId);
      if (idx === -1) {
        return prev;
      }
      return steps[idx + 1]?.id ?? prev;
    });
  }, []);

  // requestAdvanceWithProfileMode: second entry point into the engine for
  // call sites that change profileMode AND request an advance in the same
  // gesture. onboardingStepsRef still reflects the old profileMode by the
  // time React resolves this updater (hook ordering), so the next step is
  // recomputed via buildOnboardingStepOrder with nextMode passed explicitly,
  // rather than read from the ref.
  const requestAdvanceWithProfileMode = useCallback(
    (stepId: WizardStepId, nextMode: ProfileMode) => {
      setProfileMode(nextMode);
      setCurrentOnboardingStepId((prev) => {
        if (prev !== stepId) {
          return prev;
        }
        const order = buildOnboardingStepOrder({
          role: currentUser?.role as UserRoles | undefined,
          profileMode: nextMode,
          shouldSkip: shouldSkipOnboardingSteps,
        });
        const idx = order.indexOf(stepId);
        if (idx === -1) {
          return prev;
        }
        return order[idx + 1] ?? prev;
      });
    },
    [currentUser?.role, shouldSkipOnboardingSteps]
  );

  // Onboarding completion. skipDashboardRedirect is used by the recap step
  // when the calling component handles the navigation itself (messaging/
  // directory following a CTA click): the generic dashboard redirect is then
  // not applied.
  const skipDashboardRedirectRef = useRef(false);
  const onOnboardingCompleted = useCallback(
    async (skipDashboardRedirect = false) => {
      if (skipDashboardRedirect) {
        skipDashboardRedirectRef.current = true;
      }
      dispatch(
        currentUserActions.updateOnboardingStatusRequested({
          onboardingStatus: OnboardingStatus.COMPLETED,
        })
      );
    },
    [dispatch]
  );

  // The recap step's inline compose marks onboarding completed as soon as
  // "Send" is clicked (cf. onOnboardingCompleted above), which immediately
  // empties onboardingSteps (shouldSkipOnboardingSteps becomes true) and
  // unmounts RecapSuggestedMessage before the message send has had time to
  // resolve. The post-send redirect must therefore be carried by a hook that
  // survives this unmount — useWizardRedirects — rather than by a local
  // effect on the component, which would never run.
  const pendingSuggestedMessageRedirectRef = useRef(false);
  const armSuggestedMessageRedirect = useCallback(() => {
    pendingSuggestedMessageRedirectRef.current = true;
  }, []);

  // ─── Onboarding step hooks — called unconditionally ──────────────────────────
  const { onboardingStepElearning } = useOnboardingStepElearning({
    userRole: currentUser?.role as UserRoles | undefined,
    requestAdvance,
  });
  const { onboardingStepWebinar } = useOnboardingStepWebinar({
    userRole: currentUser?.role as UserRoles | undefined,
    requestAdvance,
  });
  const { onboardingStepMatchRecap } = useOnboardingStepMatchRecap({
    userRole: currentUser?.role as UserRoles | undefined,
    onOnboardingCompleted,
    onSuggestedMessageSent: armSuggestedMessageRedirect,
  });
  const { onboardingStepSocialSituation } = useOnboardingStepSocialSituation({
    user: currentUser,
  });
  const { onboardingStepPhoto } = useStepPhoto({ user: currentUser });
  const { onboardingStepCvChoice } = useStepCvChoice({
    user: currentUser,
    requestAdvanceWithProfileMode,
  });
  const { onboardingStepCvLoading } = useStepCvLoading({
    onManualFallback: handleCvGenerationManualFallback,
  });
  const { onboardingStepCvRecap } = useStepCvRecap({ user: currentUser });
  const { onboardingStepPresentation } = useStepPresentation({
    user: currentUser,
  });
  const { onboardingStepExperiences } = useStepExperiences({
    user: currentUser,
  });
  const { onboardingStepFormations } = useStepFormations({ user: currentUser });
  const { onboardingStepSkills } = useStepSkills({ user: currentUser });

  const onboardingSteps = useMemo(() => {
    const stepById: Partial<Record<WizardStepId, WizardStep>> = {
      'social-situation': onboardingStepSocialSituation,
      photo: onboardingStepPhoto,
      'cv-choice': onboardingStepCvChoice,
      'cv-loading': onboardingStepCvLoading,
      'cv-recap': onboardingStepCvRecap,
      presentation: onboardingStepPresentation,
      experiences: onboardingStepExperiences,
      formations: onboardingStepFormations,
      skills: onboardingStepSkills,
      elearning: onboardingStepElearning,
      webinar: onboardingStepWebinar,
      'match-recap': onboardingStepMatchRecap,
    };

    return buildOnboardingStepOrder({
      role: currentUser?.role as UserRoles | undefined,
      profileMode,
      shouldSkip: shouldSkipOnboardingSteps,
    })
      .map((id) => stepById[id])
      .filter((step): step is WizardStep => step !== undefined);
  }, [
    shouldSkipOnboardingSteps,
    currentUser?.role,
    profileMode,
    onboardingStepSocialSituation,
    onboardingStepPhoto,
    onboardingStepCvChoice,
    onboardingStepCvLoading,
    onboardingStepCvRecap,
    onboardingStepPresentation,
    onboardingStepExperiences,
    onboardingStepFormations,
    onboardingStepSkills,
    onboardingStepElearning,
    onboardingStepWebinar,
    onboardingStepMatchRecap,
  ]);

  useEffect(() => {
    onboardingStepsRef.current = onboardingSteps;
  }, [onboardingSteps]);

  // The index is only a display derivation (stepper) — the actual
  // advancement state is currentOnboardingStepId.
  const onboardingIdx = useMemo(() => {
    if (currentOnboardingStepId === null) {
      return null;
    }
    const idx = onboardingSteps.findIndex(
      (step) => step.id === currentOnboardingStepId
    );
    return idx === -1 ? null : idx;
  }, [onboardingSteps, currentOnboardingStepId]);

  // Auto-skip: upon arriving on a step, the engine asks it whether it can be
  // skipped without user interaction (e.g. eLearning with no remaining unit).
  useEffect(() => {
    if (currentOnboardingStepId === null) {
      return;
    }
    const step = onboardingStepsRef.current.find(
      (s) => s.id === currentOnboardingStepId
    );
    if (!step?.isAutoSkippable) {
      return;
    }
    let cancelled = false;
    step.isAutoSkippable().then((skippable) => {
      if (!cancelled && skippable) {
        requestAdvance(step.id);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [currentOnboardingStepId, requestAdvance]);

  const isProfileLoaded =
    fetchProfileStatus === ReduxRequestEvents.SUCCEEDED ||
    fetchProfileStatus === ReduxRequestEvents.FAILED;

  // profileMode is ready once initialization has completed (profileComplete arrived
  // and we decided which mode to use — even if it stayed 'pending').
  const isProfileModeReady = isProfileModeInitialized || !profileComplete;

  // Ensure profile is fetched when entering onboarding (handles direct navigation to /wizard/run)
  useEffect(() => {
    if (currentUser && fetchProfileStatus === ReduxRequestEvents.IDLE) {
      dispatch(currentUserActions.fetchCurrentProfileRequested());
    }
  }, [currentUser, fetchProfileStatus, dispatch]);

  // Determine starting onboarding step (handles resume after window close)
  useEffect(() => {
    if (
      !currentUser ||
      isOnboardingAlreadyCompleted ||
      currentOnboardingStepId !== null ||
      !isProfileLoaded ||
      !isProfileModeReady
    ) {
      return;
    }
    determineStartingStep(onboardingSteps).then((startId) => {
      if (startId === null && onboardingSteps.length > 0) {
        // All steps are already complete — finalize onboarding without going back through the UI
        dispatch(
          currentUserActions.updateOnboardingStatusRequested({
            onboardingStatus: OnboardingStatus.COMPLETED,
          })
        );
      } else {
        setCurrentOnboardingStepId(startId ?? onboardingSteps[0]?.id ?? null);
      }
    });
  }, [
    currentUser,
    isOnboardingAlreadyCompleted,
    currentOnboardingStepId,
    isProfileLoaded,
    isProfileModeReady,
    onboardingSteps,
    dispatch,
  ]);

  // Auto-advance of the cv-loading step
  const isUploadCvSucceeded = useSelector(
    uploadExternalCvSelectors.selectIsUploadExternalCvSucceeded
  );
  const isUploadCvFailed = useSelector(
    uploadExternalCvSelectors.selectIsUploadExternalCvFailed
  );
  const hasExtractedCvData = profileComplete?.hasExtractedCvData ?? false;

  useEffect(() => {
    if (profileMode !== 'cv') {
      return;
    }
    if (currentOnboardingStepId !== 'cv-loading') {
      return;
    }

    if (isUploadCvSucceeded && hasExtractedCvData) {
      requestAdvance('cv-loading');
    } else if (isUploadCvSucceeded && !hasTriggeredGenerationRef.current) {
      hasTriggeredGenerationRef.current = true;
      void generateProfileFromCV();
    }
  }, [
    profileMode,
    isUploadCvSucceeded,
    hasExtractedCvData,
    currentOnboardingStepId,
    requestAdvance,
    generateProfileFromCV,
  ]);

  // CV upload error handling: back to cv-choice
  useEffect(() => {
    if (profileMode !== 'cv') {
      return;
    }
    if (!isUploadCvFailed) {
      return;
    }

    hasTriggeredGenerationRef.current = false;
    setProfileMode('pending');
    setCurrentOnboardingStepId('cv-choice');
  }, [profileMode, isUploadCvFailed]);

  const currentStep =
    onboardingIdx !== null ? onboardingSteps[onboardingIdx] ?? null : null;

  const isInitializing = onboardingIdx === null;

  const onNext = useCallback(async () => {
    if (!currentStep || onboardingIdx === null) {
      return;
    }

    if (currentStep.incrementationIsAllowed) {
      const isAllowed = await currentStep.incrementationIsAllowed();
      if (!isAllowed) {
        return;
      }
    }

    if (currentStep.onSubmit) {
      dispatch(onboardingActions.setFormErrorMessage(null));
      setOnboardingIsLoading(true);
      const result = await currentStep.onSubmit();
      setOnboardingIsLoading(false);
      if (result === false) {
        return;
      }
    }

    const isLastOnboardingStep = onboardingIdx === onboardingSteps.length - 1;
    if (isLastOnboardingStep) {
      await onOnboardingCompleted(true);
      return;
    }

    setCurrentOnboardingStepId(onboardingSteps[onboardingIdx + 1]?.id ?? null);
  }, [
    currentStep,
    onboardingIdx,
    onboardingSteps,
    onOnboardingCompleted,
    dispatch,
  ]);

  const isLastOnboardingStep =
    onboardingIdx !== null && onboardingIdx === onboardingSteps.length - 1;

  const buttonLabel =
    currentStep?.buttonLabel ??
    (isLastOnboardingStep ? 'Terminer' : 'Étape suivante');

  const canGoBack = onboardingIdx !== null && onboardingIdx > 0;

  // Reset profileMode when going back to cv-choice step
  const onBack = useCallback(() => {
    if (onboardingIdx === null || onboardingIdx <= 0) {
      return;
    }
    const previousStep = onboardingSteps[onboardingIdx - 1];

    // If going back to cv-choice, reset profileMode
    if (previousStep?.id === 'cv-choice') {
      setProfileMode('pending');
    }

    setCurrentOnboardingStepId(previousStep?.id ?? null);
  }, [onboardingIdx, onboardingSteps]);

  const skipOnboarding = useCallback(() => {
    dispatch(
      currentUserActions.updateOnboardingStatusRequested({
        onboardingStatus: OnboardingStatus.COMPLETED,
      })
    );
  }, [dispatch]);

  return {
    steps: onboardingSteps,
    currentStepIdx: onboardingIdx,
    currentStep,
    isLoading: onboardingIsLoading,
    isInitializing,
    buttonLabel,
    onNext,
    onBack,
    canGoBack,
    isAlreadyCompleted: isOnboardingAlreadyCompleted,
    updateOnboardingStatus,
    skipDashboardRedirectRef,
    pendingSuggestedMessageRedirectRef,
    skipOnboarding,
  };
};
