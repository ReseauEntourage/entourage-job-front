import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxRequestEvents } from 'src/constants';
import { Programs } from 'src/constants/programs';
import { notificationsActions } from 'src/use-cases/notifications';
import {
  selectIsFirstReferingStep,
  selectIsLastReferingStep,
  selectIsReferingLoading,
  selectReferCandidateError,
  selectReferingCurrentStepContent,
  selectReferingCurrentStepData,
  selectReferingDataFromOtherStep,
  selectReferingSelectedProgram,
  referCandidateSelectors,
  referingActions,
  selectReferingNextStep,
  selectReferingShouldSkipStep,
} from 'src/use-cases/refering';
import {
  FlattenedReferingFormData,
  REFERING_CONFIRMATION_STEP,
  ReferingFormData,
} from './Refering.types';

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

  const selectedProgram = useSelector(selectReferingSelectedProgram);

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
      // If the user is not eligible for 360, we assign the Boost program to him
      if (
        stepContent &&
        stepContent.skippedBy &&
        stepContent.skippedBy.notEligibleFor360
      ) {
        if (valuesFromOtherStep) {
          const { department } =
            valuesFromOtherStep as FlattenedReferingFormData;
          dispatch(
            referingActions.setReferingCurrentStepData({
              program: [Programs.BOOST],
              department,
            })
          );
        }
      }
      replace(`/backoffice/referer/orienter/${nextStep}`, undefined, {
        shallow: true,
      });
    }
  }, [
    nextStep,
    replace,
    shouldSkipStep,
    dispatch,
    stepContent,
    valuesFromOtherStep,
  ]);

  useEffect(() => {
    if (referCandidateStatus === ReduxRequestEvents.SUCCEEDED) {
      push(
        {
          pathname: `/backoffice/referer/orienter/${REFERING_CONFIRMATION_STEP}`,
          query: {
            program: selectedProgram,
          },
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
  }, [
    referCandateError,
    referCandidateStatus,
    dispatch,
    push,
    selectedProgram,
  ]);

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
