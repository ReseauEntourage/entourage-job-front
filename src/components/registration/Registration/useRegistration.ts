import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  REGISTRATION_CONFIRMATION_STEP,
  RegistrationFormData,
  RegistrationFormDataKeys,
} from '../Registration.types';
import { ReduxRequestEvents } from 'src/constants';
import { notificationsActions } from 'src/use-cases/notifications';
import {
  createUserSelectors,
  registrationActions,
  selectCreateUserError,
  selectIsFirstRegistrationStep,
  selectIsLastRegistrationStep,
  selectIsRegistrationLoading,
  selectRegistrationCurrentStepContent,
  selectRegistrationCurrentStepData,
  selectRegistrationDataFromOtherStep,
  selectRegistrationNextStep,
  selectRegistrationSelectedProgram,
  selectRegistrationSelectedRole,
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

  const selectedRole = useSelector(selectRegistrationSelectedRole);
  const selectedProgram = useSelector(selectRegistrationSelectedProgram);

  const createUserStatus = useSelector(
    createUserSelectors.selectCreateUserStatus
  );
  const createUserError = useSelector(selectCreateUserError);

  const onSubmitStepForm = useCallback(
    (fields: RegistrationFormData) => {
      let fieldsToSave = fields;

      if (valuesFromOtherStep) {
        // Remove fields used only for default value
        const fieldsKeys = Object.keys(fields) as RegistrationFormDataKeys[];

        fieldsToSave = fieldsKeys.reduce((acc, curr) => {
          if (!Object.keys(valuesFromOtherStep).includes(curr)) {
            return {
              ...acc,
              [curr]: fields[curr],
            };
          }
          return acc;
        }, {} as RegistrationFormData);
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
    if (
      createUserStatus === ReduxRequestEvents.SUCCEEDED &&
      selectedProgram &&
      selectedRole
    ) {
      push(
        {
          pathname: `/inscription/${REGISTRATION_CONFIRMATION_STEP}`,
          query: {
            role: selectedRole,
            program: selectedProgram,
          },
        },
        undefined,
        {
          shallow: true,
        }
      );
    } else if (createUserStatus === ReduxRequestEvents.FAILED) {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message:
            createUserError === 'DUPLICATE_EMAIL'
              ? 'Cette adresse email est déjà utilisée'
              : 'Une erreur est survenue',
        })
      );
    }
  }, [
    createUserError,
    createUserStatus,
    dispatch,
    push,
    selectedProgram,
    selectedRole,
  ]);

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
