import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '@/src/api/types';
import { ReduxRequestEvents } from '@/src/constants';
import { useElearningQuiz } from '@/src/features/backoffice/elearning/elearning-unit/useElearningQuiz';
import { ElearningUnit } from '@/src/features/backoffice/elearning/elearning.types';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import { useIsDesktop } from '@/src/hooks/utils/usePlatforms';
import { store } from '@/src/store/store';
import {
  elearningActions,
  selectElearningUnits,
  selectFetchElearningUnitsState,
} from '@/src/use-cases/elearning';
import { Content, ElearningStepPhase } from './Content/Content';
import { ElearningSidePanel } from './SidePanel/ElearningSidePanel';

interface WizardStepElearningProps {
  userRole: User['role'] | undefined;
  triggerAdvance: () => void;
}

export const useOnboardingStepElearning = ({
  userRole,
  triggerAdvance,
}: WizardStepElearningProps) => {
  const getState = () => store.getState() as any;
  const dispatch = useDispatch();
  const isDesktop = useIsDesktop();

  const elearningFetchStatus = useSelector(
    (state: any) => selectFetchElearningUnitsState(state).status
  );
  const elearningUnits = useSelector((state: any) =>
    selectElearningUnits(state)
  ) as ElearningUnit[] | null;

  useEffect(() => {
    if (elearningFetchStatus === ReduxRequestEvents.IDLE && userRole) {
      dispatch(elearningActions.fetchElearningUnitsRequested(userRole));
    }
  }, [elearningFetchStatus, userRole, dispatch]);

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

  const skipElearning = useCallback(async (): Promise<void> => {
    triggerAdvance();
  }, [triggerAdvance]);

  // ─── Parcours séquentiel des modules ──────────────────────────────────────
  const [phase, setPhase] = useState<ElearningStepPhase>('intro');
  const [currentUnitIndex, setCurrentUnitIndex] = useState(0);
  const hasInitializedIndexRef = useRef(false);

  // Reprend au premier module non complété (résiste à un retour ultérieur sur l'étape)
  useEffect(() => {
    if (
      hasInitializedIndexRef.current ||
      elearningFetchStatus !== ReduxRequestEvents.SUCCEEDED ||
      !elearningUnits
    ) {
      return;
    }
    hasInitializedIndexRef.current = true;

    const firstIncompleteIdx = elearningUnits.findIndex(
      (unit) => unit.userCompletions.length === 0
    );

    if (firstIncompleteIdx === -1) {
      triggerAdvance();
      return;
    }

    setCurrentUnitIndex(firstIncompleteIdx);
    setPhase('intro');
  }, [elearningUnits, elearningFetchStatus, triggerAdvance]);

  const currentUnit = elearningUnits?.[currentUnitIndex];

  const handleModuleComplete = useCallback(() => {
    if (!currentUnit) {
      return;
    }

    dispatch(
      elearningActions.postElearningCompletionRequested({
        unitId: currentUnit.id,
      })
    );

    const nextIndex = currentUnitIndex + 1;
    const hasNextUnit = !!elearningUnits && nextIndex < elearningUnits.length;

    if (hasNextUnit) {
      setCurrentUnitIndex(nextIndex);
      setPhase('module');
    } else {
      triggerAdvance();
    }
  }, [currentUnit, currentUnitIndex, elearningUnits, dispatch, triggerAdvance]);

  const quiz = useElearningQuiz({
    questions: currentUnit?.questions ?? [],
    onComplete: handleModuleComplete,
  });

  // Repart de la première question à chaque changement de module
  useEffect(() => {
    quiz.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUnitIndex]);

  const handleStartTraining = useCallback(() => {
    setPhase('module');
  }, []);

  const sidePanelContent = useCallback(
    () => (
      <ElearningSidePanel
        phase={phase}
        currentUnit={currentUnit}
        isDesktop={isDesktop}
      />
    ),
    [phase, currentUnit, isDesktop]
  );

  const onboardingStepElearning = {
    isNextEnabled: hasCompletedAllUnits,
    summary: {
      title: `Comprendre le rôle et les missions du ${userRole} Entourage Pro`,
      description: 'Des modules vidéos avec des cas concrets pour être prêt',
      duration: '~10 minutes',
    },
    hideGenericStepHeader: true,
    hideGenericStepFooter: true,
    title: `Votre parcours de formation`,
    smallTitle: 'Suivre la formation',
    description: `Suivez ces modules pour rejoindre notre communauté de ${
      userRole?.toLowerCase() ?? ''
    }s bienveillants Entourage Pro.`,
    content: (
      <Content
        phase={phase}
        currentUnit={currentUnit}
        quiz={quiz}
        isDesktop={isDesktop}
        onStart={handleStartTraining}
        onSkip={skipElearning}
      />
    ),
    sidePanelContent,
    isStepCompleted: async () => {
      return ensureAndComputeHasCompleteAllUnits();
    },
    onSubmit: async () => {
      return true;
    },
    incrementationIsAllowed: async () => {
      return ensureAndComputeHasCompleteAllUnits();
    },
    section: 'formation',
  } as WizardStep;

  return { onboardingStepElearning };
};
