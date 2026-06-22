import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormWithValidation,
  FormWithValidationRef,
} from '@/src/features/forms/FormWithValidation';
import { formRegistrationCandidateEconomicSocialInformation } from '@/src/features/registration/forms/formRegistrationCandidateEconomicSocialInformation';
import { WizardStep } from '@/src/features/wizard-shell/wizard.types';
import {
  registrationActions,
  selectRegistrationData,
} from '@/src/use-cases/registration';

export function useWizardStepCandidateEligibility() {
  const dispatch = useDispatch();
  const data = useSelector(selectRegistrationData);
  const formRef = useRef<FormWithValidationRef>(null);

  const handleFormSubmit = useCallback(
    async (fields: Record<string, unknown>) => {
      dispatch(
        registrationActions.moveForwardInRegistration({
          data: fields as any,
          step: 2,
        })
      );
    },
    [dispatch]
  );

  const step: WizardStep = {
    smallTitle: 'Votre situation',
    summary: { title: 'Votre situation', duration: '~1 minute' },
    hideGenericStepHeader: undefined,
    title: 'Votre situation',
    description:
      'Ces informations nous permettent de vérifier votre éligibilité au programme.',
    content: (
      <FormWithValidation
        formSchema={formRegistrationCandidateEconomicSocialInformation}
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
