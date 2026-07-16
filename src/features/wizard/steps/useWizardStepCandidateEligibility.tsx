import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '@/src/components/ui';
import {
  FormWithValidation,
  FormWithValidationRef,
} from '@/src/features/forms/FormWithValidation';
import { formRegistrationCandidateEconomicSocialInformation } from '@/src/features/registration/forms/formRegistrationCandidateEconomicSocialInformation';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import { useStepFormSubmit } from '@/src/features/wizard/useStepFormSubmit';
import {
  registrationActions,
  selectRegistrationCurrentStep,
  selectRegistrationData,
} from '@/src/use-cases/registration';

export function useWizardStepCandidateEligibility() {
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
    id: 'candidate-eligibility',
    summary: { title: 'Votre situation', duration: '~1 minute' },
    hideGenericStepHeader: undefined,
    title:
      'Entourage Pro soutient les personnes isolées ou en situation de précarité dans leur recherche d’emploi. Deux dernières questions :',
    description: null,
    content: (
      <Card>
        <FormWithValidation
          formSchema={formRegistrationCandidateEconomicSocialInformation}
          defaultValues={(data as any) || {}}
          onSubmit={handleFormSubmit}
          noFooter
          innerRef={formRef}
        />
      </Card>
    ),
    onSubmit: useStepFormSubmit(formRef),
    section: 'inscription',
  };

  return { step };
}
