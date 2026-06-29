import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '@/src/components/ui';
import {
  FormWithValidation,
  FormWithValidationRef,
} from '@/src/features/forms/FormWithValidation';
import { formRegistrationAccount } from '@/src/features/registration/forms/formRegistrationAccount';
import { WizardStep } from '@/src/features/wizard-shell/wizard.types';
import {
  registrationActions,
  selectRegistrationData,
} from '@/src/use-cases/registration';

export function useWizardStepAccount() {
  const dispatch = useDispatch();
  const data = useSelector(selectRegistrationData);
  const formRef = useRef<FormWithValidationRef>(null);

  const handleFormSubmit = useCallback(
    async (fields: Record<string, unknown>) => {
      const { acceptCGU, confirmPassword, ...registrationFields } = fields as {
        acceptCGU: boolean;
        confirmPassword: string;
        [key: string]: unknown;
      };

      dispatch(registrationActions.setRegistrationIsEnded(true));
      dispatch(
        registrationActions.moveForwardInRegistration({
          data: registrationFields as any,
        })
      );
      dispatch(registrationActions.createUserRequested());
    },
    [dispatch]
  );

  const step: WizardStep = {
    smallTitle: 'Mon compte',
    summary: { title: 'Mon compte', duration: '~2 minutes' },
    hideGenericStepHeader: undefined,
    title: 'Créez votre compte Entourage Pro',
    description: 'Renseignez vos coordonnées pour finaliser votre inscription.',
    content: (
      <Card title="Vos informations">
        <FormWithValidation
          formSchema={formRegistrationAccount}
          defaultValues={(data as any) || {}}
          onSubmit={handleFormSubmit}
          noFooter
          innerRef={formRef}
        />
      </Card>
    ),
    onSubmit: async () => {
      const success = await formRef.current?.submit();
      return success === false ? false : undefined;
    },
    section: 'inscription',
  };

  return { step };
}
