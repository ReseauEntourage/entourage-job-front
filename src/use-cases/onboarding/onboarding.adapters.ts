import { UserProfile } from 'src/api/types';
import { createRequestAdapter } from 'src/store/utils';

export const validateFirstSecondStepOnboardingAdapter = createRequestAdapter(
  'validateFirstSecondStepOnboarding'
).withPayloads<Partial<UserProfile>, void, void>();

export const validateLastStepOnboardingAdapter = createRequestAdapter(
  'validateLastStepOnboarding'
).withPayloads<Partial<UserProfile>, void, void>();
