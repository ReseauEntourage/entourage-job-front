import { UseCaseConfigItem } from '../types';
import { slice } from './onboarding.slice';

export * from './onboarding.selectors';

export const onboardingActions = slice.actions;

export const onboardingConfig = {
  slice,
} as UseCaseConfigItem;
