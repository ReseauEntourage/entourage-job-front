import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { ReduxRequestEvents } from '@/src/constants';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import { verifyOtpSelectors } from '@/src/use-cases/authentication/authentication.selectors';
import { selectFetchCurrentProfileStatus } from '@/src/use-cases/current-user';
import { useWizardStepEmailConfirmation } from './steps/useWizardStepEmailConfirmation';

export interface EmailConfirmationPhaseState {
  step: WizardStep;
  isLoading: boolean;
  onNext: () => Promise<void>;
}

export const useEmailConfirmationPhase = (): EmailConfirmationPhaseState => {
  const step = useWizardStepEmailConfirmation();

  const fetchProfileStatus = useSelector(selectFetchCurrentProfileStatus);
  const verifyOtpIsLoading = useSelector(
    verifyOtpSelectors.selectIsVerifyOtpRequested
  );
  const isLoading =
    fetchProfileStatus === ReduxRequestEvents.REQUESTED || verifyOtpIsLoading;

  const onNext = useCallback(async () => {
    await step.onSubmit?.();
  }, [step]);

  return { step, isLoading, onNext };
};
