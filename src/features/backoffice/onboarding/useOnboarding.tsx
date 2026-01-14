import React, { useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Api } from '@/src/api';
import { Text } from '@/src/components/ui';
import { EventType } from '@/src/constants/events';
import { OnboardingStatus } from '@/src/constants/onboarding';
import { OnboardingWebinar } from '@/src/features/backoffice/onboarding/steps/step-webinar/OnboardingWebinar';

import type { AppDispatch } from '@/src/store/store';
import { currentUserActions } from '@/src/use-cases/current-user';
import { updateUserParticipationThunk } from '@/src/use-cases/events';
import { useAuthenticatedUser } from '../../../hooks/authentication/useAuthenticatedUser';
import { onboardingActions } from '../../../use-cases/onboarding';
import {
  selectCurrentOnboardingIdx,
  selectFormErrorMessage,
  selectIsLoading,
  selectWebinarSfId,
} from '../../../use-cases/onboarding/onboarding.selectors';
import { openModal } from '../../modals/Modal/openModal';
import { StyledOnboardingStepContainer } from './onboarding.styles';
import { OnboardingStep } from './onboarding.types';
import { OnboardingElearning } from './steps/step-elearning/OnboardingElearning';
import { ConfirmModalStep as OnboardingWebinarConfirmModalStep } from './steps/step-webinar/ConfirmModalStep';

/**
 * useOnboarding - Hook to manage onboarding steps and state.
 *
 * @returns {
 *   onboardingSteps: The list of onboarding steps.
 *   totalDuration: The total estimated duration of the onboarding process.
 *   currentOnboardingIdx: The index of the current onboarding step.
 *   currentOnboardingStep: The current onboarding step object.
 *   currentOnboardingStepContent: The content component of the current onboarding step.
 * }
 */

export const useOnboarding = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useAuthenticatedUser();
  const currentOnboardingIdx = useSelector(selectCurrentOnboardingIdx);
  const webinarSfId = useSelector(selectWebinarSfId);
  const formErrorMessage = useSelector(selectFormErrorMessage);
  const isLoading = useSelector(selectIsLoading);

  /**
   * Determine starting step on mount - Checks if the user is already registered for a webinar and sets the starting step accordingly.
   */
  const determineStartingStep = useCallback(async () => {
    let stepToLoad = 0;
    await Api.getAllEvents({
      eventTypes: [EventType.WELCOME_SESSION],
      limit: 1,
      offset: 0,
      departmentIds: [],
      isParticipating: true,
      includePastEvents: true,
    }).then((response) => {
      if (response.data.length > 0) {
        // User is already registered for a webinar, skip to next step
        stepToLoad = 1;
      }
    });
    return stepToLoad;
  }, []);

  /**
   * useEffect - On component mount, determine the starting onboarding step.
   */
  useEffect(() => {
    determineStartingStep().then((stepToLoad) => {
      dispatch(onboardingActions.setCurrentOnboardingIdx(stepToLoad));
    });
  }, [determineStartingStep, dispatch]);

  /**
   * onboardingSteps - Memoized array of onboarding steps based on user role.
   */
  const onboardingSteps = useMemo(
    () =>
      [
        {
          summary: {
            title: 'S’inscrire au Webinaire de bienvenue',
            description:
              "Découvrez le programme, rencontrez l'équipe, posez vos questions en direct",
            duration: '~1 minute',
          },
          title: 'Webinaire de bienvenue',
          smallTitle: 'S’inscrire au Webinaire de bienvenue',
          description:
            "Ce webinaire vous permettra de comprendre votre rôle, rencontrer l'équipe et poser toutes vos questions en direct.",
          content: (
            <StyledOnboardingStepContainer>
              <OnboardingWebinar
                webinarSfId={webinarSfId}
                onChange={(value) => {
                  dispatch(onboardingActions.setWebinarSfId(value));
                }}
              />
            </StyledOnboardingStepContainer>
          ),
          onSubmit: async () => {
            if (!webinarSfId) {
              dispatch(
                onboardingActions.setFormErrorMessage(
                  'Veuillez sélectionner une date pour le webinaire afin de pouvoir passer à l’étape suivante.'
                )
              );
              return false;
            }
            try {
              await dispatch(
                updateUserParticipationThunk({
                  eventSalesForceId: webinarSfId,
                  isParticipating: true,
                })
              ).unwrap();
              openModal(<OnboardingWebinarConfirmModalStep />);
              return true;
            } catch (e) {
              console.error(e);
              dispatch(
                onboardingActions.setFormErrorMessage(
                  "Erreur lors de l'inscription au webinaire."
                )
              );
              return false;
            }
          },
        },
        {
          summary: {
            title: `Comprendre le rôle et les missions du ${user.role} Entourage Pro`,
            description:
              'Des modules vidéos avec des cas concrets pour être prêt',
            duration: '~20 minutes',
          },
          title: `Comprendre le rôle et les missions du ${user.role} Entourage Pro`,
          smallTitle: 'Rôle et missions',
          description:
            'Des modules vidéos avec des cas concrets pour être prêt',
          content: (
            <StyledOnboardingStepContainer>
              <OnboardingElearning />
            </StyledOnboardingStepContainer>
          ),
          onSubmit: () => {
            return true;
          },
        },
        ...(user.role === 'Candidat'
          ? [
              {
                summary: {
                  title: 'Indiquer la situation sociale et économique',
                  duration: '~1-2 minutes',
                  description: 'Pour nous permettre de mieux vous connaître',
                },
                title: 'Indiquer la situation sociale et économique',
                smallTitle: 'Situation sociale et économique',
                description: 'Pour nous permettre de mieux vous connaître',
                onSubmit: () => {
                  return true;
                },
              },
            ]
          : []),
        {
          summary: {
            title: 'Compléter le profil',
            description:
              'Permettez au reste de la communauté de vous découvrir et recevez des mises en relation personnalisées',
            duration: '~4-5 minutes',
          },
          title: 'Compléter le profil',
          smallTitle: 'Compléter le profil',
          description:
            'Permettez au reste de la communauté de vous découvrir et recevez des mises en relation personnalisées',
          content: (
            <StyledOnboardingStepContainer>
              <Text>Step Profile</Text>
            </StyledOnboardingStepContainer>
          ),
          onSubmit: () => {
            return true;
          },
        },
      ] as OnboardingStep[],
    [user.role, webinarSfId, dispatch]
  );

  /**
   * totalDuration - Memoized total duration of all onboarding steps.
   */
  const totalDuration = useMemo(() => {
    return onboardingSteps
      .reduce((total, step) => {
        const durationMatch = step.summary.duration.match(
          /~(\d+)(-(\d+))? minute/
        );
        if (durationMatch) {
          const min = parseInt(durationMatch[1], 10);
          const max = durationMatch[3] ? parseInt(durationMatch[3], 10) : min;
          return total + (min + max) / 2;
        }
        return total;
      }, 0)
      .toFixed(0);
  }, [onboardingSteps]);

  /**
   * currentOnboardingStep - Memoized current onboarding step object.
   */
  const currentOnboardingStep = useMemo(() => {
    if (currentOnboardingIdx === null) {
      return null;
    }
    return onboardingSteps[currentOnboardingIdx];
  }, [onboardingSteps, currentOnboardingIdx]);

  const nextStepAllowed = true; // Placeholder for actual logic to determine if the next step is allowed

  const nextOnboardingStep = useMemo(() => {
    if (currentOnboardingIdx === null) {
      return null;
    }
    if (currentOnboardingIdx + 1 >= onboardingSteps.length) {
      return null;
    }
    return onboardingSteps[currentOnboardingIdx + 1];
  }, [onboardingSteps, currentOnboardingIdx]);

  /**
   * onOnboardingComplete - Callback when onboarding is complete.
   */
  const onOnboardingComplete = useCallback(() => {
    // Logic to mark onboarding as complete (e.g., API call)
    dispatch(
      currentUserActions.updateOnboardingStatusRequested({
        onboardingStatus: OnboardingStatus.COMPLETED,
      })
    );
  }, [dispatch]);

  /**
   * incrementStep - Callback to move to the next onboarding step.
   */
  const incrementStep = useCallback(async () => {
    if (currentOnboardingIdx === null || !currentOnboardingStep) {
      throw new Error('Current onboarding step is not defined');
    }
    if (currentOnboardingStep.onSubmit) {
      dispatch(onboardingActions.setIsLoading(true));
      const result = await currentOnboardingStep.onSubmit();
      dispatch(onboardingActions.setIsLoading(false));
      if (result === false) {
        return;
      }
    }
    dispatch(onboardingActions.setFormErrorMessage(null));
    if (currentOnboardingIdx + 1 >= onboardingSteps.length) {
      onOnboardingComplete();
      return;
    }
    dispatch(
      onboardingActions.setCurrentOnboardingIdx(currentOnboardingIdx + 1)
    );
  }, [
    currentOnboardingIdx,
    currentOnboardingStep,
    dispatch,
    onOnboardingComplete,
    onboardingSteps.length,
  ]);

  const currentOnboardingStepContent = currentOnboardingStep?.content;

  /**
   * Return values from the useOnboarding hook.
   */
  return {
    formErrorMessage,
    isLoading,
    onboardingSteps,
    totalDuration,
    currentOnboardingIdx,
    currentOnboardingStep,
    currentOnboardingStepContent,
    nextStepAllowed,
    nextOnboardingStep,
    incrementStep,
  };
};
