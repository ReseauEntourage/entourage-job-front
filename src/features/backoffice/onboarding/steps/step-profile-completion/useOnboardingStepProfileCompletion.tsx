import { StyledOnboardingStepContainer } from '../../onboarding.styles';
import { OnboardingStep } from '../../onboarding.types';
import { Content } from './Content';

export const useOnboardingStepProfileCompletion = () => {
  const onboardingStepProfileCompletion = {
    summary: {
      title: 'Compléter le profil',
      description:
        'Permettez au reste de la communauté de vous découvrir et recevez des mises en relation personnalisées',
      duration: '~4-5 minutes',
    },
    title: 'Complétez votre profil',
    smallTitle: 'Compléter le profil',
    description:
      'Permettez au reste de la communauté de vous découvrir et recevez des mises en relation personnalisées',
    content: (
      <StyledOnboardingStepContainer>
        <Content />
      </StyledOnboardingStepContainer>
    ),
    onSubmit: async () => {
      return true;
    },
    confirmationStep: {
      title: 'Félicitations ! Vous avez complété votre profil',
      subtitle: 'Vous êtes maintenant prêt à utiliser Entourage Pro',
      submitBtnTxt: 'Démarrer l’aventure Entourage Pro',
    },
  } as OnboardingStep;

  return { onboardingStepProfileCompletion };
};
