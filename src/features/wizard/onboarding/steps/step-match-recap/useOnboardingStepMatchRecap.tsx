import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import { MatchRecapContainer } from './MatchRecapContainer';

interface UseOnboardingStepMatchRecapProps {
  userRole: UserRoles | undefined;
  onOnboardingCompleted: () => Promise<void>;
  completeOnboardingSilently: () => void;
}

export const useOnboardingStepMatchRecap = ({
  userRole,
  onOnboardingCompleted,
  completeOnboardingSilently,
}: UseOnboardingStepMatchRecapProps) => {
  const onboardingStepMatchRecap = {
    summary: {
      title: 'Votre premier match',
      description: 'Découvrez un profil compatible pour bien démarrer',
      duration: '~1 minute',
    },
    hideGenericStepHeader: true,
    hideGenericStepFooter: true,
    title: '',
    smallTitle: 'Récapitulatif',
    description: '',
    content: (
      <MatchRecapContainer
        userRole={userRole}
        onOnboardingCompleted={onOnboardingCompleted}
        completeOnboardingSilently={completeOnboardingSilently}
      />
    ),
    section: 'formation',
  } as WizardStep;

  return { onboardingStepMatchRecap };
};
