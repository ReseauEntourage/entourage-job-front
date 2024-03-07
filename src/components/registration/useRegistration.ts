import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createUserSelectors,
  registrationActions,
  selectIsFirstRegistrationStep,
  selectIsLastRegistrationStep,
  selectIsRegistrationLoading,
  selectRegistrationCurrentStepContent,
  selectRegistrationCurrentStepData,
  selectRegistrationDataFromOtherStepForDefaultValue,
  selectRegistrationNextStep,
} from 'src/use-cases/registration';
import {
  REGISTRATION_CONFIRMATION_STEP,
  StepData,
  StepDataKeys,
} from './Registration/Registration.types';
import { ReduxRequestEvents } from '../../constants';
import { notificationsActions } from '../../use-cases/notifications';

export function useRegistration() {
  const { push, back } = useRouter();
  const dispatch = useDispatch();

  const isRegistrationLoading = useSelector(selectIsRegistrationLoading);

  const pageData = useSelector(selectRegistrationCurrentStepData);
  const pageContent = useSelector(selectRegistrationCurrentStepContent);
  const defaultValueFromOtherStep = useSelector(
    selectRegistrationDataFromOtherStepForDefaultValue
  );
  const isFirstRegistrationStep = useSelector(selectIsFirstRegistrationStep);
  const isLastRegistrationStep = useSelector(selectIsLastRegistrationStep);
  const nextStep = useSelector(selectRegistrationNextStep);

  const createUserStatus = useSelector(
    createUserSelectors.selectCreateUserStatus
  );

  const onSubmitStepForm = useCallback(
    (fields: StepData) => {
      let fieldsToSave = fields;

      if (pageContent?.dependsOn) {
        // Remove fields used only for default value
        const fieldsKeys: StepDataKeys[] = Object.keys(
          fields
        ) as StepDataKeys[];

        fieldsToSave = fieldsKeys.reduce((acc, curr) => {
          if (!pageContent.dependsOn?.includes(curr)) {
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
    [dispatch, isLastRegistrationStep, nextStep, pageContent?.dependsOn, push]
  );

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

  useEffect(() => {
    return () => {
      dispatch(registrationActions.createUserReset());
    };
  });

  const onBack = useCallback(back, [back]);

  return {
    isRegistrationLoading,
    pageContent,
    pageData,
    defaultValueFromOtherStep,
    isFirstRegistrationStep,
    isLastRegistrationStep,
    onSubmitStepForm,
    onBack,
  };
}
