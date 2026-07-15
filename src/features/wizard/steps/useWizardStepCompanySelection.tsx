import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormWithValidation,
  FormWithValidationRef,
} from '@/src/features/forms/FormWithValidation';
import { formRegistrationCompanySelection } from '@/src/features/registration/forms/formRegistrationCompanySelection';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import { useStepFormSubmit } from '@/src/features/wizard/useStepFormSubmit';
import {
  registrationActions,
  selectRegistrationData,
} from '@/src/use-cases/registration';

export function useWizardStepCompanySelection() {
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
    id: 'company-selection',
    summary: { title: 'Votre entreprise', duration: '~1 minute' },
    hideGenericStepHeader: undefined,
    title: 'Votre entreprise',
    description: 'Sélectionnez ou ajoutez votre entreprise.',
    content: (
      <FormWithValidation
        formSchema={formRegistrationCompanySelection}
        defaultValues={{ companyName: (data as any)?.companyName }}
        onSubmit={handleFormSubmit}
        noFooter
        innerRef={formRef}
      />
    ),
    onSubmit: useStepFormSubmit(formRef),
    section: 'inscription',
  };

  return { step };
}
