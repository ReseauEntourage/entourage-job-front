import { UserRoles } from '@/src/constants/users';
import { OnboardingStep } from '../../onboarding.types';
import { Content } from './Content/Content';

export interface useOnboardingStepNudgesProps {
  userRole: UserRoles;
}

export const useOnboardingStepNudges = ({
  userRole,
}: useOnboardingStepNudgesProps) => {
  const onboardingStepNudges = {
    summary: {
      title:
        userRole === UserRoles.CANDIDATE
          ? 'Partagez vos besoin d’aide'
          : 'Proposez vos coups de pouce',
      description:
        userRole === UserRoles.CANDIDATE
          ? 'Indiquez vos besoins auprès des coachs de la communauté'
          : 'Indiquez les types d’aide que vous souhaitez proposer aux candidats',
      duration: '~1 minute',
    },
    title:
      userRole === UserRoles.CANDIDATE
        ? 'Partagez vos besoin d’aide'
        : 'Précisez les coups de pouce que vous souhaitez apporter',
    smallTitle:
      userRole === UserRoles.CANDIDATE ? 'Vos besoins' : 'Vos coups de pouce',
    description:
      userRole === UserRoles.CANDIDATE
        ? 'Afin de vous recommander les coachs qui seraient suceptible de vous aider'
        : "Afin de vous recommander les candidats que vous seriez suceptible d'aider",
    content: <Content />,
    isStepCompleted: async () => {
      return false;
    },
    onSubmit: async () => {
      return true;
    },
    confirmationStep: {
      title: 'Merci pour ces informations !',
      subtitle: `Ces informations nous permettrons de vous proposer les bons ${
        userRole === UserRoles.CANDIDATE ? 'coachs' : 'candidats'
      }`,
      submitBtnTxt: 'Passer à l’étape suivante',
    },
    incrementationIsAllowed: async () => {
      return true;
    },
  } as OnboardingStep;

  return { onboardingStepNudges };
};
