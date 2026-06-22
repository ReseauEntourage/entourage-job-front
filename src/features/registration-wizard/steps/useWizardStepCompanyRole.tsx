import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CompanyUserRole } from '@/src/constants/company';
import { FilterConstant } from '@/src/constants/utils';
import {
  FormWithValidation,
  FormWithValidationRef,
} from '@/src/features/forms/FormWithValidation';
import { RegistrationFlow } from '@/src/features/registration/flows/flows.types';
import { formRegistrationCompanyRole } from '@/src/features/registration/forms/formRegistrationCompanyRole';
import { WizardStep } from '@/src/features/wizard-shell/wizard.types';
import {
  registrationActions,
  selectRegistrationData,
} from '@/src/use-cases/registration';

export function useWizardStepCompanyRole() {
  const dispatch = useDispatch();
  const data = useSelector(selectRegistrationData);
  const formRef = useRef<FormWithValidationRef>(null);

  const handleFormSubmit = useCallback(
    async (fields: { companyRole: FilterConstant<string> }) => {
      const companyRole = fields.companyRole as FilterConstant<CompanyUserRole>;

      if (companyRole.value === CompanyUserRole.EMPLOYEE) {
        // Employee → switch to coach flow from the beginning
        dispatch(
          registrationActions.moveForwardInRegistration({
            flow: RegistrationFlow.COACH,
            step: 0,
            data: undefined,
          })
        );
      } else {
        dispatch(
          registrationActions.moveForwardInRegistration({
            data: { companyRole },
            step: 1,
          })
        );
      }
    },
    [dispatch]
  );

  const step: WizardStep = {
    smallTitle: 'Votre rôle',
    summary: { title: 'Votre rôle', duration: '~1 minute' },
    hideGenericStepHeader: undefined,
    title: "Votre rôle au sein de l'entreprise",
    description: 'Sélectionnez votre rôle pour personnaliser votre parcours.',
    content: (
      <FormWithValidation
        formSchema={formRegistrationCompanyRole}
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
