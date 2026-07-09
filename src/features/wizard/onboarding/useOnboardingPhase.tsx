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

  // Bascule vers la saisie manuelle depuis cv-loading après le délai
  // d'attente : annule le job de génération en cours avant d'avancer.
  const handleCvGenerationManualFallback = useCallback(() => {
    void cancelProfileGeneration();
    setProfileMode('manual');
  }, [cancelProfileGeneration]);

  // Initialise profileMode depuis les données serveur au chargement
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

  // Le backend positionne onboardingStatus === COMPLETED dès la création du compte
  // pour Association et Entreprise-admin : ces rôles n'ont pas d'onboarding candidat/coach.
  const isOnboardingAlreadyCompleted =
    currentUser?.onboardingStatus === OnboardingStatus.COMPLETED;

  // Avant la création du compte (currentUser encore null), le flow d'inscription
  // sélectionné suffit déjà à savoir que l'onboarding sera skippé (Association/Entreprise) :
  // évite que les steps par défaut (photo/elearning/webinar, tagués profil/formation)
  // fassent apparaître ces sections dans le stepper pendant l'inscription.
  const isEarlyOnboardingCompletionFlow =
    registrationFlow === RegistrationFlow.REFERER ||
    registrationFlow === RegistrationFlow.COMPANY;

  const shouldSkipOnboardingSteps =
    isOnboardingAlreadyCompleted ||
    (!currentUser && isEarlyOnboardingCompletionFlow);

  // ─── Avancement centralisé ────────────────────────────────────────────────────
  // requestAdvance est le seul point d'avancement pour les étapes d'onboarding :
  // une étape ne peut faire avancer le moteur que depuis elle-même (stepId doit
  // être l'étape courante), ce qui évite qu'une avance différée (ex. fetch qui
  // résout après un changement d'étape) ne décale l'étape affichée.
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

  // requestAdvanceWithProfileMode : second point d'entrée du moteur pour les
  // call sites qui changent profileMode ET demandent une avance dans le même
  // geste. onboardingStepsRef reflète encore l'ancien profileMode au moment où
  // React résout cet updater (ordre des hooks), donc l'étape suivante est
  // recalculée via buildOnboardingStepOrder avec nextMode passé explicitement,
  // plutôt que lue depuis le ref.
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

  // Onboarding completion. skipDashboardRedirect est utilisé par l'étape récap
  // quand le composant appelant gère lui-même la navigation (messagerie/annuaire
  // suite à un clic CTA) : on n'applique alors pas la redirection dashboard générique.
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

  // L'index n'est qu'une dérivation d'affichage (stepper) — l'état d'avancement
  // réel est currentOnboardingStepId.
  const onboardingIdx = useMemo(() => {
    if (currentOnboardingStepId === null) {
      return null;
    }
    const idx = onboardingSteps.findIndex(
      (step) => step.id === currentOnboardingStepId
    );
    return idx === -1 ? null : idx;
  }, [onboardingSteps, currentOnboardingStepId]);

  // Auto-saut : à l'arrivée sur une étape, le moteur lui demande si elle peut
  // être sautée sans interaction utilisateur (ex. eLearning sans unité restante).
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
        // Toutes les étapes sont déjà complètes — finaliser l'onboarding sans repasser par l'UI
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

  // Auto-avance du step cv-loading
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

  // Gestion erreur upload CV : retour à cv-choice
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
      await onOnboardingCompleted();
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
    skipOnboarding,
  };
};
