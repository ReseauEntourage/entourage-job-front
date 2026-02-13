import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useStep } from 'src/hooks/queryParams/useStep';
import {
  referingActions,
  selectReferingCurrentStep,
} from 'src/use-cases/refering';
import { REFERING_FIRST_STEP } from './Refering.types';

export function useReferingRedirection() {
  const { replace } = useRouter();
  const dispatch = useDispatch();

  const step = useStep();

  const currentStep = useSelector(selectReferingCurrentStep);

  const shouldRedirect =
    !step || (!currentStep && step !== REFERING_FIRST_STEP);

  useEffect(() => {
    if (shouldRedirect) {
      replace(`/backoffice/referer/orienter/${REFERING_FIRST_STEP}`);
    } else {
      dispatch(referingActions.setReferingStep(step));
    }
  }, [dispatch, replace, shouldRedirect, step]);

  return { isLoading: !currentStep };
}
