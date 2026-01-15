import { Api } from '@/src/api';
import { EventType } from '@/src/constants/events';
import { OnboardingStep } from './onboarding.types';

// determineStartingStep - Determines the starting onboarding step based on user data.
export const determineStartingStep = async () => {
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
};

export const computeTotalDuration = (onboardingSteps: OnboardingStep[]) => {
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
};
