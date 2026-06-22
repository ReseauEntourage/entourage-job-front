import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserRoles } from '@/src/constants/users';
import { UserRoleByFlow } from '@/src/features/registration/registration.config';
import { Content } from '@/src/features/registration-wizard/onboarding/steps/step-nudges/Content/Content';
import { WizardStep } from '@/src/features/wizard-shell/wizard.types';
import {
  registrationActions,
  selectRegistrationCurrentStep,
  selectRegistrationSelectedFlow,
} from '@/src/use-cases/registration';

export function useWizardStepNudges() {
  const dispatch = useDispatch();
  const selectedFlow = useSelector(selectRegistrationSelectedFlow);
  const currentStep = useSelector(selectRegistrationCurrentStep);
  const userRole = selectedFlow
    ? UserRoleByFlow[selectedFlow]
    : UserRoles.CANDIDATE;

  const [selectedNudgeIds, setSelectedNudgeIds] = useState<string[]>([]);

  const step: WizardStep = {
    smallTitle:
      userRole === UserRoles.CANDIDATE ? 'Vos besoins' : 'Vos coups de pouce',
    summary: {
      title:
        userRole === UserRoles.CANDIDATE
          ? "Partagez vos besoins d'aide"
          : 'Proposez vos coups de pouce',
      description:
        userRole === UserRoles.CANDIDATE
          ? 'Indiquez vos besoins auprès des coachs de la communauté'
          : "Indiquez les types d'aide que vous souhaitez proposer aux candidats",
      duration: '~1 minute',
    },
    hideGenericStepHeader: undefined,
    title:
      userRole === UserRoles.CANDIDATE
        ? "Partagez vos besoins d'aide"
        : 'Précisez les coups de pouce que vous souhaitez apporter',
    description:
      userRole === UserRoles.CANDIDATE
        ? 'Afin de vous recommander les coachs qui seraient susceptibles de vous aider'
        : "Afin de vous recommander les candidats que vous seriez susceptibles d'aider",
    content: (
      <Content
        userRole={userRole}
        nudgeIds={selectedNudgeIds}
        onChange={setSelectedNudgeIds}
      />
    ),
    onSubmit: async () => {
      dispatch(
        registrationActions.setPreRegistrationPreferences({
          nudgeIds: selectedNudgeIds,
        })
      );
      dispatch(
        registrationActions.moveForwardInRegistration({ step: currentStep + 1 })
      );
    },
    section: 'inscription',
  };

  return { step };
}
