import React, { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  FormWithValidation,
  FormWithValidationRef,
} from '@/src/features/forms/FormWithValidation';
import { RegistrationFlow } from '@/src/features/registration/flows/flows.types';
import { formRegistrationFlowSelection } from '@/src/features/registration/forms/formRegistrationFlowSelection';
import { REGISTRATION_FIRST_STEP } from '@/src/features/registration/registration.config';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import { registrationActions } from '@/src/use-cases/registration';

export function useWizardStepFlowSelection() {
  const dispatch = useDispatch();
  const formRef = useRef<FormWithValidationRef>(null);

  const handleFormSubmit = useCallback(
    async (fields: { flow: RegistrationFlow }) => {
      const flow = fields.flow;
      dispatch(
        registrationActions.moveForwardInRegistration({
          flow,
          step: REGISTRATION_FIRST_STEP,
        })
      );
    },
    [dispatch]
  );

  const step: WizardStep = {
    smallTitle: 'Mon profil',
    summary: { title: 'Mon profil', duration: '~1 minute' },
    hideGenericStepHeader: undefined,
    title: 'Bienvenue ! Quelle est votre situation actuelle ?',
    description: 'Choisissez le profil qui correspond à votre situation.',
    content: (
      <FormWithValidation
        formSchema={formRegistrationFlowSelection}
        onSubmit={handleFormSubmit}
        noFooter
        noCompulsory
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
