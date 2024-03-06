import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  registrationActions,
  selectIsFirstRegistrationStep,
  selectIsLastRegistrationStep,
  selectIsRegistrationLoading,
  selectRegistrationCurrentStepContent,
  selectRegistrationCurrentStepData,
  selectRegistrationDataFromOtherStepForDefaultValue,
  selectRegistrationNextStep,
} from 'src/use-cases/registration';
import { StepData, StepDataKeys } from './Registration/Registration.types';

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

  const onSubmitStepForm = useCallback(
    (fields: StepData) => {
      let fieldsToSave = fields;

      if (pageContent?.dependsOn) {
        // Remove field used only for default value
        const fieldsKeys: StepDataKeys[] = Object.keys(
          fields
        ) as StepDataKeys[];

        fieldsToSave = fieldsKeys.reduce((acc, curr) => {
          if (curr !== pageContent.dependsOn) {
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

  const onBack = useCallback(back, [back]);

  return {
    isRegistrationLoading,
    pageContent,
    pageData,
    defaultValueFromOtherStep,
    isFirstRegistrationStep,
    onSubmitStepForm,
    onBack,
  };
}
