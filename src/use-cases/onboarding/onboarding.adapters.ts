import { createRequestAdapter } from 'src/store/utils';

export type SendStepDataOnboardingError = 'NOT_SAVE_DATA';

export const sendStepDataOnboardingAdapter = createRequestAdapter(
  'sendStepDataOnboarding'
).withPayloads<void, void, { error: SendStepDataOnboardingError } | null>();
