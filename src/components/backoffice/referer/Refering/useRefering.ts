import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxRequestEvents } from 'src/constants';
import { notificationsActions } from 'src/use-cases/notifications';
import {
  selectIsFirstReferingStep,
  selectIsLastReferingStep,
  selectIsReferingLoading,
  selectReferCandidateError,
  selectReferingCurrentStepContent,
  selectReferingCurrentStepData,
  selectReferingDataFromOtherStep,
  referCandidateSelectors,
  referingActions,
  selectReferingNextStep,
  selectReferingShouldSkipStep,
} from 'src/use-cases/refering';
import { REFERING_CONFIRMATION_STEP, ReferingFormData } from './Refering.types';

export function useRefering() {
  const { push, back, replace } = useRouter();
  const dispatch = useDispatch();

  const isReferingLoading = useSelector(selectIsReferingLoading);

  const stepData = useSelector(selectReferingCurrentStepData);
  const stepContent = useSelector(selectReferingCurrentStepContent);
  const valuesFromOtherStep = useSelector(selectReferingDataFromOtherStep);
  const isFirstReferingStep = useSelector(selectIsFirstReferingStep);
  const isLastReferingStep = useSelector(selectIsLastReferingStep);
  const nextStep = useSelector(selectReferingNextStep);
  const shouldSkipStep = useSelector(selectReferingShouldSkipStep);

  const referCandidateStatus = useSelector(
    referCandidateSelectors.selectReferCandidateStatus
  );

  const referCandateError = useSelector(selectReferCandidateError);

  const onSubmitStepForm = useCallback(
    async (fields: ReferingFormData) => {
      const fieldsKeys = Object.keys(fields);

      // Compute refering fields to store but exclude organization fields
      let referingFields = fields;
      if (valuesFromOtherStep) {
        referingFields = fieldsKeys.reduce((acc, curr) => {
          if (!Object.keys(valuesFromOtherStep).includes(curr)) {
            return {
              ...acc,
              [curr]: fields[curr],
            };
          }
          return acc;
        }, {} as ReferingFormData);
      }

      // Store Refering fields
      dispatch(referingActions.setReferingCurrentStepData(referingFields));

      if (!isLastReferingStep) {
        push(`/backoffice/referer/orienter/${nextStep}`, undefined, {
          shallow: true,
        });
      }
    },
    [dispatch, isLastReferingStep, nextStep, push, valuesFromOtherStep]
  );

  useEffect(() => {
    if (shouldSkipStep) {
      replace(`/backoffice/referer/orienter/${nextStep}`, undefined, {
        shallow: true,
      });
    }
  }, [nextStep, replace, shouldSkipStep, dispatch, stepContent]);

  useEffect(() => {
    if (referCandidateStatus === ReduxRequestEvents.SUCCEEDED) {
      push(
        {
          pathname: `/backoffice/referer/orienter/${REFERING_CONFIRMATION_STEP}`,
        },
        undefined,
        {
          shallow: true,
        }
      );
    } else if (referCandidateStatus === ReduxRequestEvents.FAILED) {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message:
            referCandateError === 'DUPLICATE_EMAIL'
              ? 'Cette adresse email est déjà utilisée'
              : 'Une erreur est survenue',
        })
      );
    }
  }, [referCandateError, referCandidateStatus, dispatch, push]);

  const onBack = useCallback(back, [back]);

  useEffect(() => {
    return () => {
      dispatch(referingActions.referCandidateReset());
    };
  }, [dispatch]);

  return {
    isReferingLoading,
    stepContent,
    stepData,
    defaultValues: valuesFromOtherStep,
    isFirstReferingStep,
    isLastReferingStep,
    onSubmitStepForm,
    onBack,
  };
}
