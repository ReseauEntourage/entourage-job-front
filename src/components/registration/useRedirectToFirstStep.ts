import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useStep } from 'src/hooks/queryParams/useStep';
import {
  selectIsEmptyRegistrationData,
  selectIsFirstRegistrationStep,
} from 'src/use-cases/registration';
import { REGISTRATION_FIRST_STEP } from './Registration/Registration.types';

export function useRedirectToFirstStep() {
  const isEmptyRegistrationData = useSelector(selectIsEmptyRegistrationData);
  const isFirstRegistrationStep = useSelector(selectIsFirstRegistrationStep);

  const step = useStep();

  const { replace } = useRouter();

  useEffect(() => {
    if (!step || (isEmptyRegistrationData && !isFirstRegistrationStep)) {
      replace(`/inscription/${REGISTRATION_FIRST_STEP}`);
    }
  }, [isEmptyRegistrationData, isFirstRegistrationStep, replace, step]);
}
