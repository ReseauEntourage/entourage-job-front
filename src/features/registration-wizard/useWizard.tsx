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
import { OnboardingStatus } from '@/src/constants/onboarding';
import { UserRoles } from '@/src/constants/users';
import { OnboardingCompletionModal } from '@/src/features/backoffice/onboarding/completion-modal/OnboardingCompletionModal';
import { ConfirmModalStep } from '@/src/features/backoffice/onboarding/confirm-step-modal/ConfirmModalStep';
import { determineStartingStep } from '@/src/features/backoffice/onboarding/onboarding.utils';
import { useOnboardingStepElearning } from '@/src/features/backoffice/onboarding/steps/step-elearning/useOnboardingStepElearning';
import { useOnboardingStepNudges } from '@/src/features/backoffice/onboarding/steps/step-nudges/useOnboardingStepNudges';
import { useOnboardingStepProfileCompletion } from '@/src/features/backoffice/onboarding/steps/step-profile-completion/useOnboardingStepProfileCompletion';
import { useOnboardingStepSocialSituation } from '@/src/features/backoffice/onboarding/steps/step-social-situation/useOnboardingStepSocialSituation';
import { openModal } from '@/src/features/modals/Modal/openModal';
import { WizardStep } from '@/src/features/wizard-shell/wizard.types';
import { authenticationActions } from '@/src/use-cases/authentication';
import { verifyOtpSelectors } from '@/src/use-cases/authentication/authentication.selectors';
import {
  currentUserActions,
  selectFetchCurrentProfileStatus,
  selectUpdateOnboardingStatusSelectors,
} from '@/src/use-cases/current-user';
import { selectCurrentUser } from '@/src/use-cases/current-user';
import {
  createUserSelectors,
  selectRegistrationData,
} from '@/src/use-cases/registration';
import { EmailOtpInput } from './EmailOtpInput/EmailOtpInput';
import { useRegistrationWizard } from './useRegistrationWizard';

const OTP_LENGTH = 6;

const EMAIL_CONFIRMATION_STEP: WizardStep = {
  smallTitle: 'Confirmation email',
  title: 'Confirmez votre adresse email',
  description: 'Saisissez le code reçu par email',
  summary: {
    title: 'Confirmation email',
    duration: '~1 minute',
  },
  hideGenericStepHeader: undefined,
  content: null,
};

function useWizardStepEmailConfirmation(): WizardStep {
  const dispatch = useDispatch();
  const registrationData = useSelector(selectRegistrationData) as any;
  const email = registrationData?.email as string | undefined;
  const [code, setCode] = useState('');
  const codeRef = useRef('');

  const handleCodeChange = useCallback((newCode: string) => {
    codeRef.current = newCode;
    setCode(newCode);
  }, []);

  // Auto-submit when all 6 digits are entered
  useEffect(() => {
    if (code.length === OTP_LENGTH && email) {
      dispatch(authenticationActions.verifyOtpRequested({ email, code }));
    }
  }, [code, email, dispatch]);

  return useMemo<WizardStep>(
    () => ({
      ...EMAIL_CONFIRMATION_STEP,
      content: <EmailOtpInput onCodeChange={handleCodeChange} />,
      onSubmit: async () => {
        const currentCode = codeRef.current;
        if (currentCode.length !== OTP_LENGTH || !email) {
          return false;
        }
        dispatch(
          authenticationActions.verifyOtpRequested({ email, code: currentCode })
        );
      },
    }),
    [handleCodeChange, email, dispatch]
  );
}

export interface WizardState {
  allSteps: WizardStep[];
  currentStepIdx: number;
  currentStep: WizardStep | null;
  isLoading: boolean;
  isInitializing: boolean;
  buttonLabel: string;
  onNext: () => Promise<void>;
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

  // Registration steps
  const {
    wizardSteps: registrationSteps,
    currentWizardIdx,
    currentWizardStep: currentRegistrationStep,
    incrementStep: registrationIncrementStep,
    isLoading: registrationIsLoading,
  } = useRegistrationWizard();

  // Retour à la sélection si pas de flow valide (null ou valeur non reconnue)
  useEffect(() => {
    if (!currentUser && registrationSteps.length === 0) {
      router.replace('/wizard');
    }
  }, [currentUser, registrationSteps.length, router]);

  // Onboarding step hooks — called unconditionally with null-safe user
  const { onboardingStepNudges } = useOnboardingStepNudges({
    user: currentUser,
  });
  const { onboardingStepElearning } = useOnboardingStepElearning({
    userRole: currentUser?.role as UserRoles | undefined,
  });
  const { onboardingStepSocialSituation } = useOnboardingStepSocialSituation({
    user: currentUser,
  });
  const { onboardingStepProfileCompletion } =
    useOnboardingStepProfileCompletion({
      user: currentUser,
    });

  const onboardingSteps = useMemo(() => {
    const steps = [onboardingStepNudges, onboardingStepElearning];
    if (currentUser?.role === UserRoles.CANDIDATE) {
      steps.push(onboardingStepSocialSituation);
    }
    steps.push(onboardingStepProfileCompletion);
    return steps as unknown as WizardStep[];
  }, [
    currentUser?.role,
    onboardingStepNudges,
    onboardingStepElearning,
    onboardingStepSocialSituation,
    onboardingStepProfileCompletion,
  ]);

  const [onboardingIdx, setOnboardingIdx] = useState<number | null>(null);
  const [onboardingIsLoading, setOnboardingIsLoading] = useState(false);

  const isProfileLoaded =
    fetchProfileStatus === ReduxRequestEvents.SUCCEEDED ||
    fetchProfileStatus === ReduxRequestEvents.FAILED;

  // Ensure profile is fetched when entering onboarding (handles direct navigation to /wizard/run)
  useEffect(() => {
    if (currentUser && fetchProfileStatus === ReduxRequestEvents.IDLE) {
      dispatch(currentUserActions.fetchCurrentProfileRequested());
    }
  }, [currentUser, fetchProfileStatus, dispatch]);

  // Determine starting onboarding step (handles resume after window close)
  useEffect(() => {
    if (!currentUser || onboardingIdx !== null || !isProfileLoaded) {
      return;
    }
    determineStartingStep(
      onboardingSteps as unknown as Parameters<typeof determineStartingStep>[0]
    ).then(setOnboardingIdx);
  }, [currentUser, onboardingIdx, isProfileLoaded, onboardingSteps]);

  // Redirect to dashboard after onboarding completion
  useEffect(() => {
    if (updateOnboardingStatus === ReduxRequestEvents.SUCCEEDED) {
      router.push('/backoffice/dashboard');
    }
  }, [updateOnboardingStatus, router]);

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
          await new Promise<void>((resolve) => {
            openModal(
              <ConfirmModalStep
                id={id}
                title={title}
                subtitle={subtitle}
                submitBtnTxt={submitBtnTxt}
                onSubmit={() => resolve()}
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
    currentStep,
    emailConfirmationStep,
    onboardingIdx,
    onboardingSteps.length,
    registrationIncrementStep,
    onOnboardingCompleted,
  ]);

  const isLastOnboardingStep =
    isOnboardingPhase &&
    onboardingIdx !== null &&
    onboardingIdx === onboardingSteps.length - 1;

  const buttonLabel = isOnboardingPhase
    ? isLastOnboardingStep
      ? 'Terminer'
      : 'Étape suivante'
    : isEmailConfirmationPhase
    ? 'Valider le code'
    : currentWizardIdx === registrationSteps.length - 1
    ? 'Créer mon compte'
    : 'Étape suivante';

  return {
    allSteps,
    currentStepIdx,
    currentStep,
    isLoading,
    isInitializing,
    buttonLabel,
    onNext,
  };
};
