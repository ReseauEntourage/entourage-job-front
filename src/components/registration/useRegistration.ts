import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import {
  registrationActions,
  selectIsFirstRegistrationStep,
  selectIsLastRegistrationStep,
  selectIsRegistrationLoading,
  selectRegistrationCurrentStepContent,
  selectRegistrationCurrentStepData,
  selectRegistrationNextStep,
} from 'src/use-cases/registration';
import { RegistrationForms } from './Registration/Registration.types';
import { useRegistrationStep } from './useRegistrationStep';

export function useRegistration() {
  const { push, back } = useRouter();
  const dispatch = useDispatch();

  const currentStep = useRegistrationStep();

  useEffect(() => {
    dispatch(registrationActions.setRegistrationStep(currentStep));
  }, [dispatch, currentStep]);

  const isRegistrationLoading = useSelector(selectIsRegistrationLoading);

  const pageData = useSelector(selectRegistrationCurrentStepData);
  const pageContent = useSelector(selectRegistrationCurrentStepContent);
  const isFirstRegistrationStep = useSelector(selectIsFirstRegistrationStep);
  const isLastRegistrationStep = useSelector(selectIsLastRegistrationStep);
  const nextStep = useSelector(selectRegistrationNextStep);

  const isLoading = isRegistrationLoading;

  const onSubmitStepForm = useCallback(
    (fields: ExtractFormSchemaValidation<RegistrationForms>) => {
      dispatch(registrationActions.setRegistrationCurrentStepData(fields));
      if (!isLastRegistrationStep) {
        push(`/inscription/${nextStep}`, undefined, {
          shallow: true,
        });
      }
    },
    [dispatch, isLastRegistrationStep, nextStep, push]
  );

  const onBack = useCallback(back, [back]);

  return {
    isLoading,
    pageContent,
    pageData,
    isFirstRegistrationStep,
    onSubmitStepForm,
    onBack,
  };
}
