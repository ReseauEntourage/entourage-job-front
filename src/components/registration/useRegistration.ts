import { useRouter } from 'next/router';
import { useCallback } from 'react';
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

export function useRegistration() {
  const { push, back } = useRouter();
  const dispatch = useDispatch();

  const isRegistrationLoading = useSelector(selectIsRegistrationLoading);

  const pageData = useSelector(selectRegistrationCurrentStepData);
  const pageContent = useSelector(selectRegistrationCurrentStepContent);
  const isFirstRegistrationStep = useSelector(selectIsFirstRegistrationStep);
  const isLastRegistrationStep = useSelector(selectIsLastRegistrationStep);
  const nextStep = useSelector(selectRegistrationNextStep);

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
    isRegistrationLoading,
    pageContent,
    pageData,
    isFirstRegistrationStep,
    onSubmitStepForm,
    onBack,
  };
}
