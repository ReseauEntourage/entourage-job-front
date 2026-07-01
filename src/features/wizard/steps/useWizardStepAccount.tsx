import React, { useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '@/src/components/ui';
import {
  FormWithValidation,
  FormWithValidationRef,
} from '@/src/features/forms/FormWithValidation';
import { RegistrationFlow } from '@/src/features/registration/flows/flows.types';
import { formRegistrationAccount } from '@/src/features/registration/forms/formRegistrationAccount';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import {
  registrationActions,
  selectCompatibleProfilesCount,
  selectRegistrationData,
  selectRegistrationSelectedFlow,
} from '@/src/use-cases/registration';

export function useWizardStepAccount() {
  const dispatch = useDispatch();
  const data = useSelector(selectRegistrationData);
  const selectedFlow = useSelector(selectRegistrationSelectedFlow);
  const compatibleProfilesCount = useSelector(selectCompatibleProfilesCount);
  const formRef = useRef<FormWithValidationRef>(null);

  const description = useMemo(() => {
    if (compatibleProfilesCount !== null && compatibleProfilesCount > 0) {
      if (selectedFlow === RegistrationFlow.CANDIDATE) {
        return `Vos ${compatibleProfilesCount} coachs vous attendent. Créez votre compte pour pouvoir leur écrire.`;
      }
      if (selectedFlow === RegistrationFlow.COACH) {
        return `${compatibleProfilesCount} personne${
          compatibleProfilesCount > 1 ? 's' : ''
        } pourrai${
          compatibleProfilesCount > 1 ? 'ent' : 't'
        } bénéficier de votre coup de pouce. Créez votre compte pour commencer à le${
          compatibleProfilesCount > 1 ? 's' : ''
        } soutenir.`;
      }
    }
    if (selectedFlow === RegistrationFlow.CANDIDATE) {
      return `Créez votre compte pour pouvoir écrire à vos coachs et bénéficier de leur soutien.`;
    }
    if (selectedFlow === RegistrationFlow.COACH) {
      return `Créez votre compte pour pouvoir soutenir les personnes qui en ont besoin.`;
    }
  }, [selectedFlow, compatibleProfilesCount]);

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
    description,
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
