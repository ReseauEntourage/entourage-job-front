import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormWithValidation,
  FormWithValidationRef,
} from '@/src/features/forms/FormWithValidation';
import { formRegistrationCompanySelection } from '@/src/features/registration/forms/formRegistrationCompanySelection';
import { WizardStep } from '@/src/features/wizard-shell/wizard.types';
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
    smallTitle: 'Votre entreprise',
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
    onSubmit: async () => {
      const success = await formRef.current?.submit();
      return success === false ? false : undefined;
    },
  };

  return { step };
}
