import { User } from '@/src/api/types';
import { StyledOnboardingStepContainer } from '../../onboarding.styles';
import { OnboardingStep } from '../../onboarding.types';

export interface OnboardingStepElearningProps {
  userRole: User['role'];
}

export const useOnboardingStepElearning = ({
  userRole,
}: OnboardingStepElearningProps) => {
  const onboardingStepElearning = {
    summary: {
      title: `Comprendre le rôle et les missions du ${userRole} Entourage Pro`,
      description: 'Des modules vidéos avec des cas concrets pour être prêt',
      duration: '~20 minutes',
    },
    title: `Comprendre le rôle et les missions du ${userRole} Entourage Pro`,
    smallTitle: 'Rôle et missions',
    description: 'Des modules vidéos avec des cas concrets pour être prêt',
    content: (
      <StyledOnboardingStepContainer>Content</StyledOnboardingStepContainer>
    ),
    onSubmit: async () => {
      return true;
    },
    confirmationStep: {
      title: 'Bravo ! Vous avez terminé la formation',
      subtitle: 'Vous savez à présent tout ce qu’il faut savoir.',
      submitBtnTxt: 'Continuer vers l’étape suivante',
    },
  } as OnboardingStep;

  return { onboardingStepElearning };
};
