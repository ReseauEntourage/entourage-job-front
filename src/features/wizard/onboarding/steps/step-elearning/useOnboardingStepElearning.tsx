import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '@/src/api/types';
import { ReduxRequestEvents } from '@/src/constants';
import { OnboardingStatus } from '@/src/features/wizard/onboarding/onboarding.constants';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import { WizardRecommendationsSidePanel } from '@/src/features/wizard/sidepanels/WizardRecommendationsSidePanel';
import { store } from '@/src/store/store';
import { currentUserActions } from '@/src/use-cases/current-user';
import {
  elearningActions,
  selectElearningUnits,
  selectFetchElearningUnitsState,
} from '@/src/use-cases/elearning';
import { Content } from './Content/Content';

interface WizardStepElearningProps {
  userRole: User['role'] | undefined;
}

export const useOnboardingStepElearning = ({
  userRole,
}: WizardStepElearningProps) => {
  const getState = () => store.getState() as any;
  const dispatch = useDispatch();

  const elearningFetchStatus = useSelector(
    (state: any) => selectFetchElearningUnitsState(state).status
  );
  const elearningUnits = useSelector((state: any) =>
    selectElearningUnits(state)
  ) as { userCompletions: unknown[] }[] | null;

  const hasCompletedAllUnits =
    elearningFetchStatus === ReduxRequestEvents.SUCCEEDED &&
    elearningUnits !== null &&
    elearningUnits.length > 0 &&
    elearningUnits.every((unit) => unit.userCompletions.length > 0);

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

    if (status === ReduxRequestEvents.IDLE && userRole) {
      dispatch(elearningActions.fetchElearningUnitsRequested(userRole));
    }

    await waitForElearningUnitsFetchToSettle();
    return computeHasCompleteAllUnitsFromStore();
  };

  const skipElearning = async (): Promise<void> => {
    dispatch(
      currentUserActions.updateOnboardingStatusRequested({
        onboardingStatus: OnboardingStatus.COMPLETED,
      })
    );
  };

  const sidePanelContent = useCallback(
    () => <WizardRecommendationsSidePanel />,
    []
  );

  const onboardingStepElearning = {
    isNextEnabled: hasCompletedAllUnits,
    summary: {
      title: `Comprendre le rôle et les missions du ${userRole} Entourage Pro`,
      description: 'Des modules vidéos avec des cas concrets pour être prêt',
      duration: '~10 minutes',
    },
    hideGenericStepHeader: true,
    title: `Votre parcours de formation`,
    smallTitle: 'Suivre la formation',
    description: `Suivez ces modules pour rejoindre notre communauté de ${
      userRole?.toLowerCase() ?? ''
    }s bienveillants Entourage Pro.`,
    content: <Content />,
    sidePanelContent,
    isStepCompleted: async () => {
      return ensureAndComputeHasCompleteAllUnits();
    },
    onSubmit: async () => {
      return true;
    },
    confirmationStep: {
      id: 'elearning-confirmation',
      title: 'Bravo ! Formation terminée',
      subtitle: `Vous faites maintenant partie des ${
        userRole?.toLowerCase() ?? ''
      } Entourage Pro formés.`,
      submitBtnTxt: 'Passer à l’étape suivante',
    },
    incrementationIsAllowed: async () => {
      return ensureAndComputeHasCompleteAllUnits();
    },
    onSkip: skipElearning,
    section: 'formation',
  } as WizardStep;

  return { onboardingStepElearning };
};
