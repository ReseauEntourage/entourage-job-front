import { UseCaseConfigItem } from '../types';
import { saga } from './onboarding.saga';
import { slice } from './onboarding.slice';

export * from './onboarding.selectors';

export const onboardingActions = slice.actions;

export const onboardingConfig = {
  slice,
  saga,
} as UseCaseConfigItem;
