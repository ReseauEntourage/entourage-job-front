import { useDispatch } from 'react-redux';
import { User } from '@/src/api/types';
import { ReduxRequestEvents } from '@/src/constants';
import { store } from '@/src/store/store';
import {
  elearningActions,
  selectElearningUnits,
  selectFetchElearningUnitsState,
} from '@/src/use-cases/elearning';
import { OnboardingStep } from '../../onboarding.types';
import { Content } from './Content/Content';

export interface OnboardingStepElearningProps {
  userRole: User['role'];
}

export const useOnboardingStepElearning = ({
  userRole,
}: OnboardingStepElearningProps) => {
  const getState = () => store.getState() as any;
  const dispatch = useDispatch();

  const waitForElearningUnitsFetchToSettle = async (): Promise<void> => {
    const currentStatus = selectFetchElearningUnitsState(getState()).status;

    if (
      currentStatus === ReduxRequestEvents.SUCCEEDED ||
      currentStatus === ReduxRequestEvents.FAILED
    ) {
      return;
    }

    await new Promise<void>((resolve) => {
      const unsubscribe = store.subscribe(() => {
        const status = selectFetchElearningUnitsState(getState()).status;
        if (
          status === ReduxRequestEvents.SUCCEEDED ||
          status === ReduxRequestEvents.FAILED
        ) {
          unsubscribe();
          resolve();
        }
      });
    });
  };

  const computeHasCompleteAllUnitsFromStore = (): boolean => {
    const units = selectElearningUnits(getState());
    if (!units || units.length === 0) {
      return false;
    }
    return units.every((unit) => unit.userCompletions.length > 0);
  };

  const ensureAndComputeHasCompleteAllUnits = async (): Promise<boolean> => {
    const status = selectFetchElearningUnitsState(getState()).status;

    if (status === ReduxRequestEvents.IDLE) {
      dispatch(elearningActions.fetchElearningUnitsRequested(userRole));
    }

    await waitForElearningUnitsFetchToSettle();
    return computeHasCompleteAllUnitsFromStore();
  };

  const onboardingStepElearning = {
    summary: {
      title: `Comprendre le rôle et les missions du ${userRole} Entourage Pro`,
      description: 'Des modules vidéos avec des cas concrets pour être prêt',
      duration: '~20 minutes',
    },
    hideGenericStepHeader: true,
    title: `Votre parcours de formation`,
    smallTitle: 'Rôle et missions',
    description: `Suivez ces modules pour rejoindre notre communauté de ${userRole.toLowerCase()}s bienveillants Entourage Pro.`,
    content: <Content />,
    isStepCompleted: async () => {
      return ensureAndComputeHasCompleteAllUnits();
    },
    onSubmit: async () => {
      return true;
    },
    confirmationStep: {
      title: 'Bravo ! Formation terminée',
      subtitle: `Vous faites maintenant partie des ${userRole.toLowerCase()} Entourage Pro formés.`,
      submitBtnTxt: 'Continuer vers l’étape suivante',
    },
    incrementationIsAllowed: async () => {
      return ensureAndComputeHasCompleteAllUnits();
    },
  } as OnboardingStep;

  return { onboardingStepElearning };
};
