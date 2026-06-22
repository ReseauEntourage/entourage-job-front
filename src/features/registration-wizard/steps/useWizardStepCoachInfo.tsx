import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormWithValidation,
  FormWithValidationRef,
} from '@/src/features/forms/FormWithValidation';
import { formRegistrationCoachInfo } from '@/src/features/registration/forms/formRegistrationCoachInfo';
import { WizardStep } from '@/src/features/wizard-shell/wizard.types';
import {
  registrationActions,
  selectRegistrationData,
  selectRegistrationCurrentStep,
} from '@/src/use-cases/registration';

export function useWizardStepCoachInfo() {
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
      'Ces informations nous permettent de vous mettre en relation avec des candidats à proximité.',
    content: (
      <FormWithValidation
        formSchema={formRegistrationCoachInfo}
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
  };

  return { step };
}
