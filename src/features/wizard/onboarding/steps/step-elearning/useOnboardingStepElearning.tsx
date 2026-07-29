import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { User } from '@/src/api/types';
import { Badge, BadgeVariant } from '@/src/components/ui';
import { useElearningQuiz } from '@/src/features/backoffice/elearning/elearning-unit/useElearningQuiz';
import { ElearningUnit } from '@/src/features/backoffice/elearning/elearning.types';
import {
  StyledWizardMobileStepHeaderProgressFill,
  StyledWizardMobileStepHeaderProgressStrip,
} from '@/src/features/wizard/shell/WizardMobileStepHeader.styles';
import {
  WizardStep,
  WizardStepId,
} from '@/src/features/wizard/shell/wizard.types';
import { useIsDesktop } from '@/src/hooks/utils/usePlatforms';
import { AppDispatch } from '@/src/store/store';
import {
  elearningApi,
  useGetElearningUnitsQuery,
  usePostElearningCompletionMutation,
} from '@/src/use-cases/elearning';
import { Content } from './Content/Content';
import { ElearningSidePanel } from './SidePanel/ElearningSidePanel';

interface WizardStepElearningProps {
  userRole: User['role'] | undefined;
  requestAdvance: (stepId: WizardStepId) => void;
}

export const useOnboardingStepElearning = ({
  userRole,
  requestAdvance,
}: WizardStepElearningProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const isDesktop = useIsDesktop();

  const { data: elearningUnits = null, isSuccess: hasFetchedElearningUnits } =
    useGetElearningUnitsQuery(userRole!, { skip: !userRole });
  const [postElearningCompletion] = usePostElearningCompletionMutation();

  const hasCompletedAllUnits =
    hasFetchedElearningUnits &&
    elearningUnits !== null &&
    elearningUnits.length > 0 &&
    elearningUnits.every((unit) => unit.userCompletions.length > 0);

  /**
   * Ensures `getElearningUnits` has settled (dispatching it if it hasn't
   * been triggered yet — a no-op if already cached, thanks to RTK Query's
   * own dedup) and returns the freshest units, or `null` on failure.
   * Replaces the prior `awaitElearningUnitsSettled`/`getState()` polling.
   */
  const fetchElearningUnits = useCallback(async (): Promise<
    ElearningUnit[] | null
  > => {
    if (!userRole) {
      return null;
    }

    return dispatch(elearningApi.endpoints.getElearningUnits.initiate(userRole))
      .unwrap()
      .catch(() => null);
  }, [dispatch, userRole]);

  const computeHasCompleteAllUnits = (units: ElearningUnit[] | null) => {
    if (!units || units.length === 0) {
      return false;
    }
    return units.every((unit) => unit.userCompletions.length > 0);
  };

  const skipElearning = useCallback(async (): Promise<void> => {
    requestAdvance('elearning');
  }, [requestAdvance]);

  // ─── Parcours séquentiel des modules ──────────────────────────────────────
  const [currentUnitIndex, setCurrentUnitIndex] = useState(0);
  const hasInitializedIndexRef = useRef(false);

  // Reprend au premier module non complété (résiste à un retour ultérieur sur l'étape)
  useEffect(() => {
    if (
      hasInitializedIndexRef.current ||
      !hasFetchedElearningUnits ||
      !elearningUnits
    ) {
      return;
    }
    hasInitializedIndexRef.current = true;

    const firstIncompleteIdx = elearningUnits.findIndex(
      (unit) => unit.userCompletions.length === 0
    );

    if (firstIncompleteIdx === -1) {
      // Toutes les unités sont déjà complétées (ou aucune n'est assignée au
      // rôle) : isAutoSkippable fera sauter cette étape côté moteur.
      return;
    }

    setCurrentUnitIndex(firstIncompleteIdx);
  }, [elearningUnits, hasFetchedElearningUnits]);

  const currentUnit = elearningUnits?.[currentUnitIndex];

  const handleModuleComplete = useCallback(() => {
    if (!currentUnit || !userRole) {
      return;
    }

    postElearningCompletion({ unitId: currentUnit.id, role: userRole });

    const nextIndex = currentUnitIndex + 1;
    const hasNextUnit = !!elearningUnits && nextIndex < elearningUnits.length;

    if (hasNextUnit) {
      setCurrentUnitIndex(nextIndex);
    } else {
      requestAdvance('elearning');
    }
  }, [
    currentUnit,
    currentUnitIndex,
    elearningUnits,
    postElearningCompletion,
    requestAdvance,
    userRole,
  ]);

  const quiz = useElearningQuiz({
    questions: currentUnit?.questions ?? [],
    onComplete: handleModuleComplete,
  });

  const [hasStartedCurrentVideo, setHasStartedCurrentVideo] = useState(false);

  // Repart de la première question et de l'état verrouillé à chaque changement de module
  useEffect(() => {
    quiz.reset();
    setHasStartedCurrentVideo(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUnitIndex]);

  const onVideoPlay = useCallback(() => {
    setHasStartedCurrentVideo(true);
  }, []);

  const totalUnits = elearningUnits?.length ?? 0;
  const currentUnitPosition = currentUnitIndex + 1;

  // Bypasses the generic WizardMobileStepHeader (wizard step count within the
  // section) — this step's own progress is the video count, a different metric.
  const mobileHeaderContent = (
    <>
      <Badge variant={BadgeVariant.ExtraLightTeal}>
        Formation - Vidéo {currentUnitPosition}/{totalUnits}
      </Badge>
      <StyledWizardMobileStepHeaderProgressStrip>
        <StyledWizardMobileStepHeaderProgressFill
          $percent={
            totalUnits > 0 ? (currentUnitPosition / totalUnits) * 100 : 0
          }
        />
      </StyledWizardMobileStepHeaderProgressStrip>
    </>
  );

  const sidePanelContent = useCallback(
    () => (
      <ElearningSidePanel
        currentUnit={currentUnit}
        isDesktop={isDesktop}
        onVideoPlay={onVideoPlay}
        currentUnitPosition={currentUnitPosition}
        totalUnits={totalUnits}
      />
    ),
    [currentUnit, isDesktop, onVideoPlay, currentUnitPosition, totalUnits]
  );

  const onboardingStepElearning: WizardStep = {
    id: 'elearning',
    isNextEnabled: hasCompletedAllUnits,
    summary: {
      title: `Comprendre le rôle et les missions du ${userRole} Entourage Pro`,
      description: 'Des modules vidéos avec des cas concrets pour être prêt',
      duration: '~10 minutes',
    },
    hideGenericStepHeader: true,
    hideGenericStepFooter: true,
    title: `Votre parcours de formation`,
    mobileHeaderContent,
    description: `Suivez ces modules pour rejoindre notre communauté de ${
      userRole?.toLowerCase() ?? ''
    }s bienveillants Entourage Pro.`,
    content: (
      <Content
        currentUnit={currentUnit}
        quiz={quiz}
        isDesktop={isDesktop}
        userRole={userRole}
        onSkip={skipElearning}
        hasStartedCurrentVideo={hasStartedCurrentVideo}
        onVideoPlay={onVideoPlay}
      />
    ),
    sidePanelContent,
    isStepCompleted: async () => {
      return computeHasCompleteAllUnits(await fetchElearningUnits());
    },
    isAutoSkippable: async () => {
      const units = await fetchElearningUnits();
      if (computeHasCompleteAllUnits(units)) {
        return true;
      }
      return !units || units.length === 0;
    },
    onSubmit: async () => {
      return true;
    },
    incrementationIsAllowed: async () => {
      return computeHasCompleteAllUnits(await fetchElearningUnits());
    },
    section: 'formation',
  };

  return { onboardingStepElearning };
};
