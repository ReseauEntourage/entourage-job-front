import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormWithValidation,
  FormWithValidationRef,
} from '@/src/features/forms/FormWithValidation';
import { formRegistrationCandidateInfo } from '@/src/features/registration/forms/formRegistrationCandidateInfo';
import { WizardStep } from '@/src/features/wizard-shell/wizard.types';
import {
  registrationActions,
  selectRegistrationCurrentStep,
  selectRegistrationData,
} from '@/src/use-cases/registration';

export function useWizardStepCandidateInfo() {
  const dispatch = useDispatch();
  const data = useSelector(selectRegistrationData);
  const currentStep = useSelector(selectRegistrationCurrentStep);
  const formRef = useRef<FormWithValidationRef>(null);

  const handleFormSubmit = useCallback(
    async (fields: Record<string, unknown>) => {
      dispatch(
        registrationActions.moveForwardInRegistration({
          data: fields as any,
          step: currentStep + 1,
        })
      );
    },
    [dispatch, currentStep]
  );

  const step: WizardStep = {
    smallTitle: 'Vos informations',
    summary: { title: 'Vos informations', duration: '~2 minutes' },
    hideGenericStepHeader: undefined,
    title: 'Parlez-nous de vous',
    description:
      'Ces informations nous permettent de vous proposer des coachs à proximité.',
    content: (
      <FormWithValidation
        formSchema={formRegistrationCandidateInfo}
        defaultValues={(data as any) || {}}
        onSubmit={handleFormSubmit}
        noFooter
        innerRef={formRef}
      />
    ),
    onSubmit: async () => {
      const success = await formRef.current?.submit();
      return success === false ? false : undefined;
    },
    section: 'inscription',
  };

  return { step };
}
