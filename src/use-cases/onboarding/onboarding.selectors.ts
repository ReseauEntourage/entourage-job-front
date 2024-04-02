import { validateLastStepOnboardingAdapter } from './onboarding.adapters';
import { RootState } from './onboarding.slice';

export const selectOnboarding = (state: RootState) => state.onboarding;

export const selectCurrentOnboardingStep = (state: RootState) =>
  selectOnboarding(state).currentStep;

export const selectShouldLaunchOnboarding = (state: RootState) =>
  selectOnboarding(state).shouldLaunchOnboarding;

export const validateLastStepOnboardingSelectors =
  validateLastStepOnboardingAdapter.getSelectors<RootState>(
    (state) => state.onboarding.validateLastStepOnboarding
  );
