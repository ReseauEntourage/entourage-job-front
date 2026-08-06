import { UseCaseConfigItem } from '../types';
import './onboarding.listeners';
import { slice } from './onboarding.slice';

export * from './onboarding.selectors';
export * from './onboarding.api';

export const onboardingActions = slice.actions;

export const onboardingConfig = {
  slice,
} as UseCaseConfigItem;
