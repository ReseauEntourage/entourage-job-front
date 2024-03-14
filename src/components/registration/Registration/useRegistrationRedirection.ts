import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { REGISTRATION_FIRST_STEP } from '../Registration.types';
import { useStep } from 'src/hooks/queryParams/useStep';
import {
  registrationActions,
  selectRegistrationCurrentStep,
} from 'src/use-cases/registration';

export function useRegistrationRedirection() {
  const { replace } = useRouter();
  const dispatch = useDispatch();

  const step = useStep();

  const currentStep = useSelector(selectRegistrationCurrentStep);

  const shouldRedirect =
    !step || (!currentStep && step !== REGISTRATION_FIRST_STEP);

  useEffect(() => {
    if (shouldRedirect) {
      replace(`/inscription/${REGISTRATION_FIRST_STEP}`);
    } else {
      dispatch(registrationActions.setRegistrationStep(step));
    }
  }, [dispatch, replace, shouldRedirect, step]);

  return { isLoading: !currentStep };
}
