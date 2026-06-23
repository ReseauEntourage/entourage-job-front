import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserRoles } from '@/src/constants/users';
import { UserRoleByFlow } from '@/src/features/registration/registration.config';
import { WizardStep } from '@/src/features/wizard-shell/wizard.types';
import {
  registrationActions,
  selectPreRegistrationPreferences,
  selectRegistrationCurrentStep,
  selectRegistrationSelectedFlow,
} from '@/src/use-cases/registration';
import { Api } from 'src/api';
import { PublicProfile } from 'src/api/types';
import { NetworkPreviewStep } from './NetworkPreviewStep/NetworkPreviewStep';

export function useWizardStepNetworkPreview() {
  const dispatch = useDispatch();
  const selectedFlow = useSelector(selectRegistrationSelectedFlow);
  const currentStep = useSelector(selectRegistrationCurrentStep);
  const preRegistrationPreferences = useSelector(
    selectPreRegistrationPreferences
  );
  const userRole = selectedFlow
    ? UserRoleByFlow[selectedFlow]
    : UserRoles.CANDIDATE;

  const isCandidate = userRole === UserRoles.CANDIDATE;

  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const nudgeIds = preRegistrationPreferences?.nudgeIds ?? [];
  const businessSectorIds = preRegistrationPreferences?.businessSectorIds ?? [];
  const nudgeIdsKey = nudgeIds.join(',');
  const businessSectorIdsKey = businessSectorIds.join(',');

  useEffect(() => {
    setIsLoading(true);
    Api.getPreRegistrationCompatibleProfiles({
      role: userRole,
      nudgeIds,
      businessSectorIds,
    })
      .then(({ data }) => {
        setProfiles(data.profiles);
        setCount(data.count);
      })
      .catch(() => {
        setProfiles([]);
        setCount(0);
      })
      .finally(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole, nudgeIdsKey, businessSectorIdsKey]);

  const step: WizardStep = {
    smallTitle: 'Le réseau',
    summary: {
      title: 'Découvrez le réseau',
      description: isCandidate
        ? 'Les coachs qui peuvent vous aider'
        : 'Les candidats qui ont besoin de vous',
      duration: '~30 secondes',
    },
    hideGenericStepHeader: undefined,
    title: isCandidate
      ? 'Voici les coachs qui peuvent vous aider'
      : 'Voici les candidats qui ont besoin de vous',
    description: isCandidate
      ? 'Ces coachs correspondent à votre profil et sont disponibles pour vous accompagner'
      : 'Ces candidats correspondent à vos critères et attendent votre aide',
    content: (
      <NetworkPreviewStep
        userRole={userRole}
        profiles={profiles}
        count={count}
        isLoading={isLoading}
      />
    ),
    buttonLabel: 'Créer mon compte',
    onSubmit: async () => {
      dispatch(
        registrationActions.moveForwardInRegistration({ step: currentStep + 1 })
      );
    },
    section: 'inscription',
  };

  return { step };
}
