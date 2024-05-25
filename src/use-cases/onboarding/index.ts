import { createExtendedSlice } from 'src/store/utils';
import { saga } from './onboarding.saga';
import { extraSelectors } from './onboarding.selectors';
import { slice } from './onboarding.slice';

/**
 * @deprecated
 */
export * from './onboarding.selectors';
export const onboardingActions = slice.actions;

export const onboarding = createExtendedSlice({
  slice,
  saga,
  extraSelectors,
});
