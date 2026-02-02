import { OnboardingStep } from '../../onboarding.types';
import { Content } from './Content';

export const useOnboardingStepSocialSituation = () => {
  const onboardingStepSocialSituation = {
    summary: {
      title: 'Indiquer la situation sociale et économique',
      duration: '~1-2 minutes',
      description: 'Pour nous permettre de mieux vous connaître',
    },
    title: 'Indiquer la situation sociale et économique',
    smallTitle: 'Votre situation',
    description: 'Pour nous permettre de mieux vous connaître',
    onSubmit: async () => {
      return true;
    },
    content: <Content />,
    confirmationStep: {
      title: 'Félicitations ! Vous avez complété vos informations',
      subtitle:
        'Ces informations nous aideront à mieux vous accompagner dans votre parcours.',
      submitBtnTxt: 'Continuer vers l’étape suivante',
    },
  } as OnboardingStep;

  return { onboardingStepSocialSituation };
};
