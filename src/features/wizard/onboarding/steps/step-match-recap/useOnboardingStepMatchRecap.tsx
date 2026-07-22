import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import { MatchRecapContainer } from './MatchRecapContainer';

interface UseOnboardingStepMatchRecapProps {
  userRole: UserRoles | undefined;
  onOnboardingCompleted: (skipDashboardRedirect?: boolean) => Promise<void>;
  onSuggestedMessageSent: () => void;
}

export const useOnboardingStepMatchRecap = ({
  userRole,
  onOnboardingCompleted,
  onSuggestedMessageSent,
}: UseOnboardingStepMatchRecapProps) => {
  const onboardingStepMatchRecap: WizardStep = {
    id: 'match-recap',
    summary: {
      title: 'Votre premier match',
      description: 'Découvrez un profil compatible pour bien démarrer',
      duration: '~1 minute',
    },
    hideGenericStepHeader: true,
    hideGenericStepFooter: true,
    title: '',
    description: '',
    content: (
      <MatchRecapContainer
        userRole={userRole}
        onOnboardingCompleted={onOnboardingCompleted}
        onSuggestedMessageSent={onSuggestedMessageSent}
      />
    ),
    section: 'formation',
  };

  return { onboardingStepMatchRecap };
};
