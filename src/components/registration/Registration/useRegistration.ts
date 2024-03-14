import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  REGISTRATION_CONFIRMATION_STEP,
  StepData,
  StepDataKeys,
} from '../Registration.types';
import { ReduxRequestEvents } from 'src/constants';
import { notificationsActions } from 'src/use-cases/notifications';
import {
  createUserSelectors,
  registrationActions,
  selectIsFirstRegistrationStep,
  selectIsLastRegistrationStep,
  selectIsRegistrationLoading,
  selectRegistrationCurrentStepContent,
  selectRegistrationCurrentStepData,
  selectRegistrationDataFromOtherStep,
  selectRegistrationNextStep,
  selectRegistrationShouldSkipStep,
} from 'src/use-cases/registration';

export function useRegistration() {
  const { push, back, replace } = useRouter();
  const dispatch = useDispatch();

  const isRegistrationLoading = useSelector(selectIsRegistrationLoading);

  const stepData = useSelector(selectRegistrationCurrentStepData);
  const stepContent = useSelector(selectRegistrationCurrentStepContent);
  const valuesFromOtherStep = useSelector(selectRegistrationDataFromOtherStep);
  const isFirstRegistrationStep = useSelector(selectIsFirstRegistrationStep);
  const isLastRegistrationStep = useSelector(selectIsLastRegistrationStep);
  const nextStep = useSelector(selectRegistrationNextStep);
  const shouldSkipStep = useSelector(selectRegistrationShouldSkipStep);

  const createUserStatus = useSelector(
    createUserSelectors.selectCreateUserStatus
  );

  const onSubmitStepForm = useCallback(
    (fields: StepData) => {
      let fieldsToSave = fields;

      if (valuesFromOtherStep) {
        // Remove fields used only for default value
        const fieldsKeys: StepDataKeys[] = Object.keys(
          fields
        ) as StepDataKeys[];

        fieldsToSave = fieldsKeys.reduce((acc, curr) => {
          if (!Object.keys(valuesFromOtherStep).includes(curr)) {
            return {
              ...acc,
              [curr]: fields[curr],
            };
          }
          return acc;
        }, {} as StepData);
      }

      dispatch(
        registrationActions.setRegistrationCurrentStepData(fieldsToSave)
      );

      if (!isLastRegistrationStep) {
        push(`/inscription/${nextStep}`, undefined, {
          shallow: true,
        });
      }
    },
    [dispatch, isLastRegistrationStep, nextStep, push, valuesFromOtherStep]
  );

  useEffect(() => {
    if (shouldSkipStep) {
      replace(`/inscription/${nextStep}`, undefined, {
        shallow: true,
      });
    }
  }, [nextStep, replace, shouldSkipStep]);

  useEffect(() => {
    if (createUserStatus === ReduxRequestEvents.SUCCEEDED) {
      push(`/inscription/${REGISTRATION_CONFIRMATION_STEP}`, undefined, {
        shallow: true,
      });
    } else if (createUserStatus === ReduxRequestEvents.FAILED) {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message: `Une erreur est survenue`,
        })
      );
    }
  }, [createUserStatus, dispatch, push]);

  const onBack = useCallback(back, [back]);

  useEffect(() => {
    return () => {
      dispatch(registrationActions.createUserReset());
    };
  }, [dispatch]);

  return {
    isRegistrationLoading,
    stepContent,
    stepData,
    defaultValues: valuesFromOtherStep,
    isFirstRegistrationStep,
    isLastRegistrationStep,
    onSubmitStepForm,
    onBack,
  };
}
