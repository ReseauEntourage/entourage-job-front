import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import { UnionToIntersection } from 'src/utils/Types';
import { formOnboardingCandidateHelps } from './Onboarding/forms/schemas/formOnboardingCandidateHelps';
import { formOnboardingCandidateJob } from './Onboarding/forms/schemas/formOnboardingCandidateJob';
import { formOnboardingCandidateProfile } from './Onboarding/forms/schemas/formOnboardingCandidateProfile';
import { formOnboardingCoachHelps } from './Onboarding/forms/schemas/formOnboardingCoachHelps';
import { formOnboardingCoachJob } from './Onboarding/forms/schemas/formOnboardingCoachJob';
import { formOnboardingCoachProfile } from './Onboarding/forms/schemas/formOnboardingCoachProfile';

export type OnboardingStep = 0 | 1 | 2 | 3; // 0 means no onboarding

export type OnboardingFormSchemas =
  | typeof formOnboardingCandidateHelps
  | typeof formOnboardingCoachHelps
  | typeof formOnboardingCandidateJob
  | typeof formOnboardingCoachJob
  | typeof formOnboardingCoachProfile
  | typeof formOnboardingCandidateProfile;

export type OnboardingFormData =
  ExtractFormSchemaValidation<OnboardingFormSchemas>;

export type FlattenedOnboardingFormData =
  UnionToIntersection<OnboardingFormData>;
