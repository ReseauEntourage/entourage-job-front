import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text } from '@/src/components/ui';
import { OnboardingWebinar } from '@/src/features/backoffice/onboarding/steps/step-onboarding/OnboardingWebinar';
import { onboardingActions } from '../use-cases/onboarding';
import { selectCurrentOnboardingIdx } from '../use-cases/onboarding/onboarding.selectors';
import { useAuthenticatedUser } from './authentication/useAuthenticatedUser';

export interface OnboardingStep {
  summary: {
    title: string;
    description?: string;
    duration: string;
  };
  title: React.ReactNode;
  smallTitle: string;
  description: React.ReactNode;
  content: React.ReactNode;
}

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
  const dispatch = useDispatch();
  const user = useAuthenticatedUser();
  const currentOnboardingIdx = useSelector(selectCurrentOnboardingIdx);

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
          smallTitle: 'Webinaire de bienvenue',
          description:
            "Ce webinaire vous permettra de comprendre votre rôle, rencontrer l'équipe et poser toutes vos questions en direct.",
          content: <OnboardingWebinar />,
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
            <>
              <Text>Step Formation</Text>
            </>
          ),
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
            <>
              <Text>Step Profile</Text>
            </>
          ),
        },
      ] as OnboardingStep[],
    [user.role]
  );

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

  const currentOnboardingStep = useMemo(
    () => onboardingSteps[currentOnboardingIdx],
    [onboardingSteps, currentOnboardingIdx]
  );

  const nextStepAllowed = true; // Placeholder for actual logic to determine if the next step is allowed

  const onOnboardingComplete = useCallback(() => {
    // Logic to mark onboarding as complete (e.g., API call)
    alert('Onboarding complete!');
  }, []);

  const incrementStep = useCallback(() => {
    if (currentOnboardingIdx + 1 >= onboardingSteps.length) {
      onOnboardingComplete();
      return;
    }
    dispatch(
      onboardingActions.setCurrentOnboardingIdx(currentOnboardingIdx + 1)
    );
  }, [
    currentOnboardingIdx,
    dispatch,
    onOnboardingComplete,
    onboardingSteps.length,
  ]);

  return {
    onboardingSteps,
    totalDuration,
    currentOnboardingIdx,
    currentOnboardingStep,
    currentOnboardingStepContent: currentOnboardingStep.content,
    nextStepAllowed,
    incrementStep,
  };
};
