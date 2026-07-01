import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text, LucidIcon, Card } from '@/src/components/ui';
import {
  FormWithValidation,
  FormWithValidationRef,
} from '@/src/features/forms/FormWithValidation';
import { formRegistrationCandidateInfo } from '@/src/features/registration/forms/formRegistrationCandidateInfo';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import {
  registrationActions,
  selectRegistrationCurrentStep,
  selectRegistrationData,
} from '@/src/use-cases/registration';
import { StyledDescriptionContainer } from './StepInfo.styles';

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
    title: 'Quelques infos pour vérifier que le programme vous correspond.',
    description: (
      <StyledDescriptionContainer>
        <LucidIcon name="Lock" size={13} color="darkGray" />
        <Text color="darkGray">Vos informations sont sécurisées</Text>
      </StyledDescriptionContainer>
    ),
    content: (
      <Card title="Vous concernant">
        <FormWithValidation
          formSchema={formRegistrationCandidateInfo}
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
