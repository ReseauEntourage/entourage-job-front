import { useRouter } from 'next/router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxRequestEvents } from '@/src/constants';
import { UserRoles } from '@/src/constants/users';
import { openModal } from '@/src/features/modals/Modal/openModal';
import { OnboardingCompletionModal } from '@/src/features/wizard/onboarding/completion-modal/OnboardingCompletionModal';
import { ConfirmModalStep } from '@/src/features/wizard/onboarding/confirm-step-modal/ConfirmModalStep';
import { OnboardingStatus } from '@/src/features/wizard/onboarding/onboarding.constants';
import { determineStartingStep } from '@/src/features/wizard/onboarding/onboarding.utils';
import { useOnboardingStepElearning } from '@/src/features/wizard/onboarding/steps/step-elearning/useOnboardingStepElearning';
import { ProfileMode } from '@/src/features/wizard/onboarding/steps/step-profile-completion/profile-steps/types';
import { useStepCvChoice } from '@/src/features/wizard/onboarding/steps/step-profile-completion/profile-steps/useStepCvChoice';
import { useStepCvLoading } from '@/src/features/wizard/onboarding/steps/step-profile-completion/profile-steps/useStepCvLoading';
import { useStepCvRecap } from '@/src/features/wizard/onboarding/steps/step-profile-completion/profile-steps/useStepCvRecap';
import { useStepExperiences } from '@/src/features/wizard/onboarding/steps/step-profile-completion/profile-steps/useStepExperiences';
import { useStepFormations } from '@/src/features/wizard/onboarding/steps/step-profile-completion/profile-steps/useStepFormations';
import { useStepPhoto } from '@/src/features/wizard/onboarding/steps/step-profile-completion/profile-steps/useStepPhoto';
import { useStepSkills } from '@/src/features/wizard/onboarding/steps/step-profile-completion/profile-steps/useStepSkills';
import { useOnboardingStepSocialSituation } from '@/src/features/wizard/onboarding/steps/step-social-situation/useOnboardingStepSocialSituation';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import { useCurrentUserProfileComplete } from '@/src/hooks/current-user/useCurrentUserProfileComplete';
import { useProfileGeneration } from '@/src/hooks/useProfileGeneration';
import { authenticationActions } from '@/src/use-cases/authentication';
import {
  logoutSelectors,
  verifyOtpSelectors,
} from '@/src/use-cases/authentication/authentication.selectors';
import {
  currentUserActions,
  selectCurrentUser,
  selectFetchCurrentProfileStatus,
  selectUpdateOnboardingStatusSelectors,
  uploadExternalCvSelectors,
} from '@/src/use-cases/current-user';
import { createUserSelectors } from '@/src/use-cases/registration';
import {
  EMAIL_CONFIRMATION_STEP,
  useWizardStepEmailConfirmation,
} from './steps/useWizardStepEmailConfirmation';
import { useRegistrationWizard } from './useRegistrationWizard';

export interface WizardState {
  allSteps: WizardStep[];
  currentStepIdx: number;
  currentStep: WizardStep | null;
  isLoading: boolean;
  isInitializing: boolean;
  buttonLabel: string;
  onNext: () => Promise<void>;
  onBack: () => void;
  canGoBack: boolean;
  sidePanelContent: ((mode: 'compact' | 'full') => React.ReactNode) | undefined;
  mobileBottomSheet: boolean;
  isOnboardingPhase: boolean;
  skipOnboarding: () => void;
}

export const useWizard = (): WizardState => {
  const dispatch = useDispatch();
  const router = useRouter();

  const currentUser = useSelector(selectCurrentUser);
  const createUserStatus = useSelector(
    createUserSelectors.selectCreateUserStatus
  );
  const fetchProfileStatus = useSelector(selectFetchCurrentProfileStatus);
  const updateOnboardingStatus = useSelector(
    selectUpdateOnboardingStatusSelectors.selectUpdateOnboardingStatusStatus
  );
  const isLogoutSucceeded = useSelector(
    logoutSelectors.selectIsLogoutSucceeded
  );

  // Registration steps
  const {
    wizardSteps: registrationSteps,
    currentWizardIdx,
    currentWizardStep: currentRegistrationStep,
    incrementStep: registrationIncrementStep,
    decrementStep: registrationDecrementStep,
    canGoBack: registrationCanGoBack,
    isLoading: registrationIsLoading,
  } = useRegistrationWizard();

  // Retour à la sélection si pas de flow valide (null ou valeur non reconnue)
  useEffect(() => {
    if (!currentUser && registrationSteps.length === 0) {
      router.replace('/wizard');
    }
  }, [currentUser, registrationSteps.length, router]);

  // Redirection vers /login après déconnexion depuis le wizard
  useEffect(() => {
    if (isLogoutSucceeded) {
      dispatch(authenticationActions.logoutReset());
      router.push('/login');
    }
  }, [isLogoutSucceeded, router, dispatch]);

  // ─── Profile mode ────────────────────────────────────────────────────────────

  const [profileMode, setProfileMode] = useState<ProfileMode>('pending');
  const [onboardingIdx, setOnboardingIdx] = useState<number | null>(null);
  const [onboardingIsLoading, setOnboardingIsLoading] = useState(false);

  const profileComplete = useCurrentUserProfileComplete();
  const { generateProfileFromCV } = useProfileGeneration();
  const hasTriggeredGenerationRef = useRef(false);

  // Task 2.2 – Initialise profileMode depuis les données serveur au chargement
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

  // ─── Trigger advance helper ───────────────────────────────────────────────────
  const triggerAdvance = useCallback(() => {
    setOnboardingIdx((prev) => (prev !== null ? prev + 1 : 0));
  }, []);

  // ─── Onboarding step hooks — called unconditionally ──────────────────────────
  const { onboardingStepElearning } = useOnboardingStepElearning({
    userRole: currentUser?.role as UserRoles | undefined,
  });
  const { onboardingStepSocialSituation } = useOnboardingStepSocialSituation({
    user: currentUser,
  });
  const { onboardingStepPhoto } = useStepPhoto({ user: currentUser });
  const { onboardingStepCvChoice } = useStepCvChoice({
    user: currentUser,
    setProfileMode,
    triggerAdvance,
  });
  const { onboardingStepCvLoading } = useStepCvLoading();
  const { onboardingStepCvRecap } = useStepCvRecap({ user: currentUser });
  const { onboardingStepExperiences } = useStepExperiences({
    user: currentUser,
  });
  const { onboardingStepFormations } = useStepFormations({ user: currentUser });
  const { onboardingStepSkills } = useStepSkills({ user: currentUser });

  // Task 2.3 – onboardingSteps dynamique selon profileMode
  const onboardingSteps = useMemo(() => {
    const steps: WizardStep[] = [];

    if (currentUser?.role === UserRoles.CANDIDATE) {
      steps.push(onboardingStepSocialSituation);
    }

    // Profile steps always start with photo + cv-choice
    steps.push(onboardingStepPhoto);
    steps.push(onboardingStepCvChoice);

    // Dynamic path steps
    if (profileMode === 'cv') {
      steps.push(onboardingStepCvLoading);
      steps.push(onboardingStepCvRecap);
    } else if (profileMode === 'manual') {
      steps.push(onboardingStepExperiences);
      steps.push(onboardingStepFormations);
      steps.push(onboardingStepSkills);
    }

    steps.push(onboardingStepElearning);
    return steps;
  }, [
    currentUser?.role,
    profileMode,
    onboardingStepSocialSituation,
    onboardingStepPhoto,
    onboardingStepCvChoice,
    onboardingStepCvLoading,
    onboardingStepCvRecap,
    onboardingStepExperiences,
    onboardingStepFormations,
    onboardingStepSkills,
    onboardingStepElearning,
  ]);

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
      onboardingIdx !== null ||
      !isProfileLoaded ||
      !isProfileModeReady
    ) {
      return;
    }
    determineStartingStep(
      onboardingSteps as unknown as Parameters<typeof determineStartingStep>[0]
    ).then((startIdx) => {
      if (startIdx === null && onboardingSteps.length > 0) {
        // Toutes les étapes sont déjà complètes — finaliser l'onboarding sans repasser par l'UI
        dispatch(
          currentUserActions.updateOnboardingStatusRequested({
            onboardingStatus: OnboardingStatus.COMPLETED,
          })
        );
      } else {
        setOnboardingIdx(startIdx ?? 0);
      }
    });
  }, [
    currentUser,
    onboardingIdx,
    isProfileLoaded,
    isProfileModeReady,
    onboardingSteps,
    dispatch,
  ]);

  // Redirect to dashboard after onboarding completion
  useEffect(() => {
    if (updateOnboardingStatus === ReduxRequestEvents.SUCCEEDED) {
      router.push('/backoffice/dashboard');
    }
  }, [updateOnboardingStatus, router]);

  // Task 2.4 – Auto-avance du step cv-loading
  const isUploadCvSucceeded = useSelector(
    uploadExternalCvSelectors.selectIsUploadExternalCvSucceeded
  );
  const isUploadCvFailed = useSelector(
    uploadExternalCvSelectors.selectIsUploadExternalCvFailed
  );
  const hasExtractedCvData = profileComplete?.hasExtractedCvData ?? false;

  // Compute position-based indices (structure is deterministic based on role + profileMode)
  const candidateOffset = currentUser?.role === UserRoles.CANDIDATE ? 1 : 0;
  const cvChoiceStepIndex = candidateOffset + 1; // photo is at +0, cv-choice at +1
  const cvLoadingStepIndex = profileMode === 'cv' ? candidateOffset + 2 : -1; // cv-loading is right after cv-choice

  useEffect(() => {
    if (profileMode !== 'cv') {
      return;
    }
    if (onboardingIdx === null) {
      return;
    }
    if (onboardingIdx !== cvLoadingStepIndex) {
      return;
    }

    if (isUploadCvSucceeded && hasExtractedCvData) {
      setOnboardingIdx((prev) => (prev !== null ? prev + 1 : 0));
    } else if (isUploadCvSucceeded && !hasTriggeredGenerationRef.current) {
      hasTriggeredGenerationRef.current = true;
      void generateProfileFromCV();
    }
  }, [
    profileMode,
    isUploadCvSucceeded,
    hasExtractedCvData,
    onboardingIdx,
    cvLoadingStepIndex,
    generateProfileFromCV,
  ]);

  // Task 2.5 – Gestion erreur upload CV
  useEffect(() => {
    if (profileMode !== 'cv') {
      return;
    }
    if (!isUploadCvFailed) {
      return;
    }

    hasTriggeredGenerationRef.current = false;
    setProfileMode('pending');
    setOnboardingIdx(cvChoiceStepIndex);
  }, [profileMode, isUploadCvFailed, cvChoiceStepIndex]);

  // Phase flags
  const accountJustCreated = createUserStatus === ReduxRequestEvents.SUCCEEDED;
  const isOnboardingPhase = !!currentUser;
  const isEmailConfirmationPhase = accountJustCreated && !currentUser;

  const emailConfirmationStep = useWizardStepEmailConfirmation();

  // Unified step list for the progress bar — toutes les phases toujours visibles
  const allSteps = useMemo(() => {
    return [...registrationSteps, EMAIL_CONFIRMATION_STEP, ...onboardingSteps];
  }, [registrationSteps, onboardingSteps]);

  const emailConfirmationOffset = registrationSteps.length;
  const onboardingOffset = registrationSteps.length + 1;

  const currentStepIdx = isOnboardingPhase
    ? onboardingOffset + (onboardingIdx ?? 0)
    : isEmailConfirmationPhase
    ? emailConfirmationOffset
    : currentWizardIdx;

  const currentStep = isOnboardingPhase
    ? onboardingIdx !== null
      ? onboardingSteps[onboardingIdx] ?? null
      : null
    : isEmailConfirmationPhase
    ? emailConfirmationStep
    : currentRegistrationStep;

  const verifyOtpIsLoading = useSelector(
    verifyOtpSelectors.selectIsVerifyOtpRequested
  );

  const emailConfirmationIsLoading =
    fetchProfileStatus === ReduxRequestEvents.REQUESTED || verifyOtpIsLoading;

  const isLoading = isOnboardingPhase
    ? onboardingIsLoading
    : isEmailConfirmationPhase
    ? emailConfirmationIsLoading
    : registrationIsLoading;

  const isInitializing = isOnboardingPhase && onboardingIdx === null;

  // Onboarding completion
  const onOnboardingCompleted = useCallback(async () => {
    await new Promise<void>((resolve) => {
      openModal(<OnboardingCompletionModal onDone={() => resolve()} />);
    });
    dispatch(
      currentUserActions.updateOnboardingStatusRequested({
        onboardingStatus: OnboardingStatus.COMPLETED,
      })
    );
  }, [dispatch]);

  const onNext = useCallback(async () => {
    if (isOnboardingPhase) {
      if (!currentStep || onboardingIdx === null) {
        return;
      }

      const step = currentStep as unknown as {
        incrementationIsAllowed?: () => Promise<boolean>;
        onSubmit?: () => Promise<boolean>;
        confirmationStep?: {
          title: string;
          subtitle: string;
          submitBtnTxt: string;
          id: string;
        };
      };

      if (step.incrementationIsAllowed) {
        const isAllowed = await step.incrementationIsAllowed();
        if (!isAllowed) {
          return;
        }
      }

      if (step.onSubmit) {
        setOnboardingIsLoading(true);
        const result = await step.onSubmit();
        setOnboardingIsLoading(false);
        if (result === false) {
          return;
        }

        if (step.confirmationStep) {
          const { title, subtitle, submitBtnTxt, id } = step.confirmationStep;
          const nextStep =
            onboardingIdx !== null
              ? onboardingSteps[onboardingIdx + 1] ?? null
              : null;
          await new Promise<void>((resolve) => {
            openModal(
              <ConfirmModalStep
                id={id}
                title={title}
                subtitle={subtitle}
                submitBtnTxt={submitBtnTxt}
                onSubmit={() => resolve()}
                nextStep={nextStep}
              />
            );
          });
        }
      }

      const isLastOnboardingStep = onboardingIdx === onboardingSteps.length - 1;
      if (isLastOnboardingStep) {
        await onOnboardingCompleted();
        return;
      }

      setOnboardingIdx((prev) => (prev !== null ? prev + 1 : 0));
      return;
    }

    if (isEmailConfirmationPhase) {
      const result = await emailConfirmationStep.onSubmit?.();
      if (result === false) {
        return;
      }
      return;
    }

    await registrationIncrementStep();
  }, [
    isOnboardingPhase,
    isEmailConfirmationPhase,
    registrationIncrementStep,
    currentStep,
    onboardingIdx,
    onboardingSteps,
    onOnboardingCompleted,
    emailConfirmationStep,
  ]);

  const isLastOnboardingStep =
    isOnboardingPhase &&
    onboardingIdx !== null &&
    onboardingIdx === onboardingSteps.length - 1;

  // Task 6.4 – buttonLabel resolution: check step-level buttonLabel first
  const currentStepButtonLabel = (
    currentStep as unknown as { buttonLabel?: string } | null
  )?.buttonLabel;

  const buttonLabel = isOnboardingPhase
    ? currentStepButtonLabel ??
      (isLastOnboardingStep ? 'Terminer' : 'Étape suivante')
    : isEmailConfirmationPhase
    ? 'Valider le code'
    : (currentStep as WizardStep | null)?.buttonLabel ??
      (currentWizardIdx === registrationSteps.length - 1
        ? 'Créer mon compte'
        : 'Étape suivante');

  const canGoBack = isOnboardingPhase
    ? onboardingIdx !== null && onboardingIdx > 0
    : !isEmailConfirmationPhase && registrationCanGoBack;

  // Task 2.6 – Reset profileMode when going back to cv-choice step (index computed above)
  const onBack = useCallback(() => {
    if (!canGoBack) {
      return;
    }
    if (isOnboardingPhase) {
      const nextIdx =
        onboardingIdx !== null && onboardingIdx > 0
          ? onboardingIdx - 1
          : onboardingIdx;

      // If going back to cv-choice, reset profileMode
      if (nextIdx === cvChoiceStepIndex) {
        setProfileMode('pending');
      }

      setOnboardingIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
      return;
    }
    registrationDecrementStep();
  }, [
    canGoBack,
    isOnboardingPhase,
    onboardingIdx,
    cvChoiceStepIndex,
    registrationDecrementStep,
  ]);

  const skipOnboarding = useCallback(() => {
    dispatch(
      currentUserActions.updateOnboardingStatusRequested({
        onboardingStatus: OnboardingStatus.COMPLETED,
      })
    );
  }, [dispatch]);

  return {
    allSteps,
    currentStepIdx,
    currentStep,
    isLoading,
    isInitializing,
    buttonLabel,
    onNext,
    onBack,
    canGoBack,
    sidePanelContent: currentStep?.sidePanelContent,
    mobileBottomSheet: currentStep?.mobileBottomSheet ?? false,
    isOnboardingPhase,
    skipOnboarding,
  };
};
