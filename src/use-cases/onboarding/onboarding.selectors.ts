import { RootState } from './onboarding.slice';

export const selectCurrentOnboardingIdx = (state: RootState) =>
  state.onboarding.currentOnboardingIdx;
