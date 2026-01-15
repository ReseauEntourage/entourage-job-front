import { Api } from '@/src/api';
import { EventType } from '@/src/constants/events';

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
