import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOnboardingPhase } from '@/src/features/wizard/onboarding/useOnboardingPhase';
import { resolveWizardPhase } from '@/src/features/wizard/resolveWizardPhase';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import { useEmailConfirmationPhase } from '@/src/features/wizard/useEmailConfirmationPhase';
import { useWizardRedirects } from '@/src/features/wizard/useWizardRedirects';
import { logoutSelectors } from '@/src/use-cases/authentication/authentication.selectors';
import {
  fetchUserSelectors,
  selectCurrentUser,
} from '@/src/use-cases/current-user';
import { onboardingActions } from '@/src/use-cases/onboarding';
import { createUserSelectors } from '@/src/use-cases/registration';
import { EMAIL_CONFIRMATION_STEP } from './steps/useWizardStepEmailConfirmation';
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

  const currentUser = useSelector(selectCurrentUser);
  const createUserStatus = useSelector(
    createUserSelectors.selectCreateUserStatus
  );
  const isLogoutSucceeded = useSelector(
    logoutSelectors.selectIsLogoutSucceeded
  );

  // Registration phase
  const {
    wizardSteps: registrationSteps,
    currentWizardIdx,
    currentWizardStep: currentRegistrationStep,
    incrementStep: registrationIncrementStep,
    decrementStep: registrationDecrementStep,
    canGoBack: registrationCanGoBack,
    isLoading: registrationIsLoading,
    effectiveFlow: registrationFlow,
  } = useRegistrationWizard();

  const isFetchUserSucceeded = useSelector(
    fetchUserSelectors.selectIsFetchUserSucceeded
  );
  const isFetchUserFailed = useSelector(
    fetchUserSelectors.selectIsFetchUserFailed
  );
  const isFetchUserFinished = isFetchUserSucceeded || isFetchUserFailed;

  const onboarding = useOnboardingPhase({ currentUser, registrationFlow });
  const emailConfirmation = useEmailConfirmationPhase();

  const phase = resolveWizardPhase(currentUser, createUserStatus);
  const isOnboardingPhase = phase === 'onboarding';
  const isEmailConfirmationPhase = phase === 'email-confirmation';

  useWizardRedirects({
    currentUser,
    isFetchUserFinished,
    registrationStepsLength: registrationSteps.length,
    isLogoutSucceeded,
    isOnboardingAlreadyCompleted: onboarding.isAlreadyCompleted,
    updateOnboardingStatus: onboarding.updateOnboardingStatus,
    skipDashboardRedirectRef: onboarding.skipDashboardRedirectRef,
  });

  // Unified step list for the progress bar — toutes les phases toujours visibles
  const allSteps = useMemo(() => {
    return [...registrationSteps, EMAIL_CONFIRMATION_STEP, ...onboarding.steps];
  }, [registrationSteps, onboarding.steps]);

  const emailConfirmationOffset = registrationSteps.length;
  const onboardingOffset = registrationSteps.length + 1;

  const currentStepIdx = isOnboardingPhase
    ? onboardingOffset + (onboarding.currentStepIdx ?? 0)
    : isEmailConfirmationPhase
    ? emailConfirmationOffset
    : currentWizardIdx;

  // Le message d'erreur d'étape ne doit pas survivre à un changement d'étape
  useEffect(() => {
    dispatch(onboardingActions.setFormErrorMessage(null));
  }, [currentStepIdx, dispatch]);

  const currentStep = isOnboardingPhase
    ? onboarding.currentStep
    : isEmailConfirmationPhase
    ? emailConfirmation.step
    : currentRegistrationStep;

  const isLoading = isOnboardingPhase
    ? onboarding.isLoading
    : isEmailConfirmationPhase
    ? emailConfirmation.isLoading
    : registrationIsLoading;

  // Initialisation : détermination du step de reprise, ou résolution de
  // l'utilisateur courant au rechargement direct (évite le flash de l'alerte
  // d'erreur tant que /current n'a pas répondu)
  const isInitializing =
    (isOnboardingPhase && onboarding.isInitializing) ||
    (!currentUser && !isFetchUserFinished && registrationSteps.length === 0);

  const onNext = useCallback(async () => {
    if (isOnboardingPhase) {
      await onboarding.onNext();
      return;
    }

    if (isEmailConfirmationPhase) {
      await emailConfirmation.onNext();
      return;
    }

    await registrationIncrementStep();
  }, [
    isOnboardingPhase,
    isEmailConfirmationPhase,
    onboarding,
    emailConfirmation,
    registrationIncrementStep,
  ]);

  const buttonLabel = isOnboardingPhase
    ? onboarding.buttonLabel
    : isEmailConfirmationPhase
    ? 'Valider le code'
    : (currentStep as WizardStep | null)?.buttonLabel ??
      (currentWizardIdx === registrationSteps.length - 1
        ? 'Créer mon compte'
        : 'Étape suivante');

  const canGoBack = isOnboardingPhase
    ? onboarding.canGoBack
    : !isEmailConfirmationPhase && registrationCanGoBack;

  const onBack = useCallback(() => {
    if (!canGoBack) {
      return;
    }
    if (isOnboardingPhase) {
      onboarding.onBack();
      return;
    }
    registrationDecrementStep();
  }, [canGoBack, isOnboardingPhase, onboarding, registrationDecrementStep]);

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
    skipOnboarding: onboarding.skipOnboarding,
  };
};
