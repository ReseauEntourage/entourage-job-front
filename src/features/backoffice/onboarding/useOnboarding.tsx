import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ReduxRequestEvents } from '@/src/constants';
import { OnboardingStatus } from '@/src/constants/onboarding';

import { store, type AppDispatch } from '@/src/store/store';
import {
  currentUserActions,
  selectForceOnboardingAsCompletedSelectors,
  selectUpdateOnboardingStatusSelectors,
} from '@/src/use-cases/current-user';
import { useAuthenticatedUser } from '../../../hooks/authentication/useAuthenticatedUser';
import { onboardingActions } from '../../../use-cases/onboarding';
import {
  selectCurrentOnboardingIdx,
  selectFormErrorMessage,
  selectIsLoading,
} from '../../../use-cases/onboarding/onboarding.selectors';
import { openModal } from '../../modals/Modal/openModal';
import { ConfirmModalStep } from './confirm-step-modal/ConfirmModalStep';
import { OnboardingStep, UseOnboardingReturn } from './onboarding.types';
import {
  computeTotalDuration,
  determineStartingStep,
} from './onboarding.utils';
import { useOnboardingStepElearning } from './steps/step-elearning/useOnboardingStepElearning';
import { useOnboardingStepNudges } from './steps/step-nudges/useOnboardingStepNudges';
import { useOnboardingStepProfileCompletion } from './steps/step-profile-completion/useOnboardingStepProfileCompletion';
import { useOnboardingStepSocialSituation } from './steps/step-social-situation/useOnboardingStepSocialSituation';
import { useOnboardingStepWebinar } from './steps/step-webinar/useOnboardingStepWebinar';

/**
 * useOnboarding - Custom hook to manage onboarding state and actions.
 * @returns UseOnboardingReturn - An object containing onboarding state and actions.
 */
export const useOnboarding = (): UseOnboardingReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useAuthenticatedUser();
  const router = useRouter();
  const currentOnboardingIdx = useSelector(selectCurrentOnboardingIdx);
  const formErrorMessage = useSelector(selectFormErrorMessage);
  const isLoading = useSelector(selectIsLoading);
  const updateOnboardingStatus = useSelector(
    selectUpdateOnboardingStatusSelectors.selectUpdateOnboardingStatusStatus
  );
  const forceOnboardingAsCompletedStatus = useSelector(
    selectForceOnboardingAsCompletedSelectors.selectForceOnboardingAsCompletedStatus
  );
  const { onboardingStepWebinar } = useOnboardingStepWebinar();
  const { onboardingStepSocialSituation } = useOnboardingStepSocialSituation();
  const { onboardingStepElearning } = useOnboardingStepElearning({
    userRole: user.role,
  });
  const { onboardingStepNudges } = useOnboardingStepNudges({
    userRole: user.role,
  });

  const { onboardingStepProfileCompletion } =
    useOnboardingStepProfileCompletion();

  // incrementationIsAllowed - State boolean indicating if moving to the next step is allowed.
  const [incrementationIsAllowed, setIncrementationIsAllowed] =
    useState<boolean>(false);

  // useEffect - Redirect based on onboarding status updates.
  useEffect(() => {
    if (
      updateOnboardingStatus === 'SUCCEEDED' &&
      user?.onboardingStatus === OnboardingStatus.IN_PROGRESS &&
      router.pathname !== '/backoffice/onboarding/run'
    ) {
      router.push('/backoffice/onboarding/run');
    }
    if (
      updateOnboardingStatus === 'SUCCEEDED' &&
      user?.onboardingStatus === OnboardingStatus.COMPLETED &&
      router.pathname !== '/backoffice/dashboard'
    ) {
      router.push('/backoffice/dashboard');
    }
  }, [updateOnboardingStatus, user, router]);

  // useEffect - Redirect to dashboard upon successful force completion of onboarding.
  useEffect(() => {
    if (forceOnboardingAsCompletedStatus === ReduxRequestEvents.SUCCEEDED) {
      router.push('/backoffice/dashboard'); // Redirect to dashboard after forcing onboarding completion
    }
  }, [router, forceOnboardingAsCompletedStatus]);

  // onboardingSteps - Memoized array of onboarding steps based on user role.
  const onboardingSteps: OnboardingStep[] = useMemo(() => {
    return [
      onboardingStepWebinar,
      onboardingStepElearning,
      ...(user.role === 'Candidat' ? [onboardingStepSocialSituation] : []),
      onboardingStepNudges,
      onboardingStepProfileCompletion,
    ];
  }, [
    user.role,
    onboardingStepWebinar,
    onboardingStepElearning,
    onboardingStepNudges,
    onboardingStepSocialSituation,
    onboardingStepProfileCompletion,
  ]);

  // totalDuration - Memoized total duration of all onboarding steps.
  const totalDuration = computeTotalDuration(onboardingSteps);

  // currentOnboardingStep - Memoized current onboarding step object.
  const currentOnboardingStep = useMemo(() => {
    if (
      currentOnboardingIdx === null ||
      currentOnboardingIdx >= onboardingSteps.length
    ) {
      return null;
    }
    return onboardingSteps[currentOnboardingIdx];
  }, [onboardingSteps, currentOnboardingIdx]);

  // useEffect - Update incrementationIsAllowed when current step changes.
  useEffect(() => {
    let cancelled = false;
    let running = false;

    const checkIncrementationAllowed = async () => {
      if (running) {
        return;
      }
      running = true;

      if (currentOnboardingIdx === null || !currentOnboardingStep) {
        if (!cancelled) {
          setIncrementationIsAllowed(false);
        }
        running = false;
        return;
      }
      if (!currentOnboardingStep.incrementationIsAllowed) {
        if (!cancelled) {
          setIncrementationIsAllowed(true);
        }
        running = false;
        return;
      }

      const result = await currentOnboardingStep.incrementationIsAllowed();
      if (!cancelled) {
        setIncrementationIsAllowed((prev) => (prev === result ? prev : result));
      }
      running = false;
    };

    checkIncrementationAllowed();

    // Important: some steps become “complete” after async store updates
    // (e.g. elearning units fetched), without changing the current step.
    const unsubscribe = store.subscribe(() => {
      checkIncrementationAllowed();
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [currentOnboardingIdx, currentOnboardingStep]);

  // nextOnboardingStep - Memoized next onboarding step object.
  const nextOnboardingStep = useMemo(() => {
    if (currentOnboardingIdx === null) {
      return null;
    }
    if (currentOnboardingIdx + 1 >= onboardingSteps.length) {
      return null;
    }
    return onboardingSteps[currentOnboardingIdx + 1];
  }, [onboardingSteps, currentOnboardingIdx]);

  // onOnboardingComplete - Callback when onboarding is complete.
  const onOnboardingCompleted = useCallback(() => {
    dispatch(
      currentUserActions.updateOnboardingStatusRequested({
        onboardingStatus: OnboardingStatus.COMPLETED,
      })
    );
  }, [dispatch]);

  // incrementStep - Callback to move to the next onboarding step.
  const incrementStep = useCallback(async () => {
    if (currentOnboardingIdx === null || !currentOnboardingStep) {
      throw new Error('Current onboarding step or steps are not defined');
    }

    if (currentOnboardingStep.incrementationIsAllowed) {
      const isAllowed = await currentOnboardingStep.incrementationIsAllowed();
      if (!isAllowed) {
        return;
      }
    }
    if (currentOnboardingStep.onSubmit) {
      dispatch(onboardingActions.setIsLoading(true));
      const result = await currentOnboardingStep.onSubmit();
      dispatch(onboardingActions.setIsLoading(false));
      if (result === false) {
        return;
      }
      // Run confirmation step modal if defined in the current step
      if (currentOnboardingStep.confirmationStep) {
        const { title, subtitle, submitBtnTxt } =
          currentOnboardingStep.confirmationStep;
        await new Promise<void>((resolve) => {
          openModal(
            <ConfirmModalStep
              title={title}
              subtitle={subtitle}
              submitBtnTxt={submitBtnTxt}
              onSubmit={() => resolve()}
            />
          );
        });
      }
    }
    dispatch(onboardingActions.setFormErrorMessage(null));
    if (
      typeof onboardingSteps.length !== 'number' ||
      currentOnboardingIdx + 1 >= onboardingSteps.length
    ) {
      onOnboardingCompleted();
      return;
    }
    dispatch(
      onboardingActions.setCurrentOnboardingIdx(currentOnboardingIdx + 1)
    );
  }, [
    currentOnboardingIdx,
    currentOnboardingStep,
    dispatch,
    onOnboardingCompleted,
    onboardingSteps,
  ]);

  // skipOnboarding - Callback to skip the onboarding process.
  const skipOnboarding = useCallback(() => {
    dispatch(currentUserActions.forceOnboardingAsCompletedRequested());
  }, [dispatch]);

  // currentOnboardingStepContent - Content component of the current onboarding step.
  const currentOnboardingStepContent = currentOnboardingStep?.content;

  // useEffect - Initialize current onboarding step on mount.
  useEffect(() => {
    // Only set starting step if not already set
    if (currentOnboardingIdx !== null) {
      return;
    }
    determineStartingStep(onboardingSteps).then((stepToLoad) => {
      dispatch(onboardingActions.setCurrentOnboardingIdx(stepToLoad));
    });
  }, [currentOnboardingIdx, dispatch, onboardingSteps]);

  // Return values from the useOnboarding hook.
  return {
    formErrorMessage,
    isLoading,
    onboardingSteps,
    totalDuration,
    currentOnboardingIdx,
    currentOnboardingStep,
    currentOnboardingStepContent,
    incrementationIsAllowed,
    nextOnboardingStep,
    incrementStep,
    skipOnboarding,
  };
};
