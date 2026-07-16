import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserRoles } from '@/src/constants/users';
import { UserRoleByFlow } from '@/src/features/registration/registration.config';
import { Content } from '@/src/features/wizard/onboarding/steps/step-nudges/Content/Content';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import { WizardCompatibleProfilesSidePanel } from '@/src/features/wizard/sidepanels/WizardCompatibleProfilesSidePanel';
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

  const sidePanelContent = useCallback(
    (mode: 'compact' | 'full') => (
      <WizardCompatibleProfilesSidePanel mode={mode} subtitleContext="nudges" />
    ),
    []
  );

  useEffect(() => {
    dispatch(
      registrationActions.setPreRegistrationPreferences({
        nudgeIds: selectedNudgeIds,
      })
    );
  }, [selectedNudgeIds, dispatch]);

  const step: WizardStep = {
    id: 'nudges',
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
        ? 'Pour commencer : sur quoi aimeriez-vous un coup de pouce ?'
        : 'Pour commencer : comment aimeriez-vous aider ?',
    description:
      userRole === UserRoles.CANDIDATE
        ? 'Ça nous permet de trouver tout de suite les coachs qui peuvent vous soutenir.'
        : 'Ça nous permet de trouver tout de suite les personnes que vous pourriez soutenir.',
    content: (
      <Content
        userRole={userRole}
        nudgeIds={selectedNudgeIds}
        onChange={setSelectedNudgeIds}
      />
    ),
    sidePanelContent,
    mobileBottomSheet: true,
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
