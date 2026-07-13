import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxRequestEvents } from '@/src/constants';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import { verifyOtpSelectors } from '@/src/use-cases/authentication/authentication.selectors';
import { selectFetchCurrentProfileStatus } from '@/src/use-cases/current-user';
import { registrationActions } from '@/src/use-cases/registration';
import { useWizardStepEmailConfirmation } from './steps/useWizardStepEmailConfirmation';

export interface EmailConfirmationPhaseState {
  step: WizardStep;
  isLoading: boolean;
  onNext: () => Promise<void>;
  canGoBack: boolean;
  onBack: () => void;
  onEditEmail: () => void;
}

export interface UseEmailConfirmationPhaseParams {
  goToLastStep: () => void;
  goToStepById: (id: 'account') => void;
}

export const useEmailConfirmationPhase = ({
  goToLastStep,
  goToStepById,
}: UseEmailConfirmationPhaseParams): EmailConfirmationPhaseState => {
  const dispatch = useDispatch();

  const onBack = useCallback(() => {
    dispatch(registrationActions.createUserReset());
    dispatch(registrationActions.setRegistrationIsEnded(false));
    goToLastStep();
  }, [dispatch, goToLastStep]);

  const onEditEmail = useCallback(() => {
    dispatch(registrationActions.createUserReset());
    dispatch(registrationActions.setRegistrationIsEnded(false));
    goToStepById('account');
  }, [dispatch, goToStepById]);

  const step = useWizardStepEmailConfirmation(onEditEmail);

  const fetchProfileStatus = useSelector(selectFetchCurrentProfileStatus);
  const verifyOtpIsLoading = useSelector(
    verifyOtpSelectors.selectIsVerifyOtpRequested
  );
  const isLoading =
    fetchProfileStatus === ReduxRequestEvents.REQUESTED || verifyOtpIsLoading;

  const onNext = useCallback(async () => {
    await step.onSubmit?.();
  }, [step]);

  return { step, isLoading, onNext, canGoBack: true, onBack, onEditEmail };
};
