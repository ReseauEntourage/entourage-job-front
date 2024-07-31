import { UserProfile } from 'src/api/types';
import { createRequestAdapter } from 'src/store/utils';

export const validateFirstSecondStepOnboardingAdapter = createRequestAdapter(
  'validateFirstSecondStepOnboarding'
).withPayloads<Partial<UserProfile>, void, void>();

export const validateLastStepOnboardingAdapter = createRequestAdapter(
  'validateLastStepOnboarding'
).withPayloads<
  {
    userProfile: Partial<UserProfile>;
    optinNewsletter: boolean;
  },
  void,
  void
>();
