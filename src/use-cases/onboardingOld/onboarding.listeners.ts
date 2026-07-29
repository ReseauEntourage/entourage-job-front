import { listenerMiddleware } from '@/src/store/listenerMiddleware';
import { selectAuthenticatedUser } from '../current-user';
import {
  onboardingApi,
  SEND_STEP_DATA_ONBOARDING_FIXED_CACHE_KEY,
} from './onboarding.api';
import {
  selectOnboardingCurrentStep,
  selectOnboardingData,
  selectOnboardingFlow,
} from './onboarding.selectors';
import { slice } from './onboarding.slice';
import { findNextNotSkippableStep } from './onboarding.utils';

const { actions } = slice;

/** Translates `launchOnboardingSaga`. */
listenerMiddleware.startListening({
  actionCreator: actions.launchOnboarding,
  effect: (action, listenerApi) => {
    const state = listenerApi.getState() as never;
    const currentUser = selectAuthenticatedUser(state);
    const flow = action.payload;

    const nextStep = findNextNotSkippableStep(0, currentUser, flow);
    listenerApi.dispatch(actions.setOnboardingStep(nextStep));
  },
});

/**
 * Translates `setOnboardingCurrentStepDataSaga` + `sendStepDataOnboardingSaga`'s
 * trigger.
 */
listenerMiddleware.startListening({
  actionCreator: actions.setOnboardingCurrentStepData,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(actions.setOnboardingIsLoading(true));

    const state = listenerApi.getState() as never;
    const flow = selectOnboardingFlow(state);
    const currentStep = selectOnboardingCurrentStep(state);
    const data = selectOnboardingData(state);
    const currentUser = selectAuthenticatedUser(state);

    if (!flow) {
      throw new Error('Onboarding flow is not defined in onboarding state');
    }

    const stepData = data[currentStep]?.[flow];

    if (!stepData) {
      throw new Error('Step data not found for the current step and flow');
    }

    listenerApi.dispatch(
      onboardingApi.endpoints.sendStepDataOnboarding.initiate(
        { flow, currentStep, stepData, userId: currentUser.id },
        { fixedCacheKey: SEND_STEP_DATA_ONBOARDING_FIXED_CACHE_KEY }
      )
    );
  },
});

/** Translates `setOnboardingStepSaga` — necessary to force render of form on step change. */
listenerMiddleware.startListening({
  actionCreator: actions.setOnboardingStep,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(actions.setOnboardingIsLoading(false));
  },
});
