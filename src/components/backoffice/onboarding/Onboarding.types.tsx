import React from 'react';
import { User } from '../../../api/types';
import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import { UnionKeys, UnionToIntersection } from 'src/utils/Types';
import { formOnboardingCandidateAI } from './Onboarding/forms/schemas/formOnboardingCandidateAI';
import { formOnboardingCandidateJob } from './Onboarding/forms/schemas/formOnboardingCandidateJob';
import { formOnboardingCandidateNudges } from './Onboarding/forms/schemas/formOnboardingCandidateNudges';
import { formOnboardingCandidateProfile } from './Onboarding/forms/schemas/formOnboardingCandidateProfile';
import { formOnboardingCandidateSocialSituation } from './Onboarding/forms/schemas/formOnboardingCandidateSocialSituation';
import { formOnboardingCoachJob } from './Onboarding/forms/schemas/formOnboardingCoachJob';
import { formOnboardingCoachNudges } from './Onboarding/forms/schemas/formOnboardingCoachNudges';
import { formOnboardingCoachProfile } from './Onboarding/forms/schemas/formOnboardingCoachProfile';
import { formOnboardingCompanyGoal } from './Onboarding/forms/schemas/formOnboardingCompanyGoal';
import { formOnboardingCompanyInformation } from './Onboarding/forms/schemas/formOnboardingCompanyInformation';
import { formOnboardingEthicsCharter } from './Onboarding/forms/schemas/formOnboardingEthicsCharter';

export enum OnboardingFlow {
  CANDIDATE = 'CANDIDATE',
  COACH = 'COACH',
  COMPANY = 'COMPANY',
}

export type OnboardingStep = 0 | 1 | 2 | 3 | 4 | 5; // 0 means no onboarding
export const ONBOARDING_FIRST_STEP = 1 as OnboardingStep;

export type CandidateOnboardingForm =
  | typeof formOnboardingEthicsCharter
  | typeof formOnboardingCandidateNudges
  | typeof formOnboardingCandidateJob
  | typeof formOnboardingCandidateProfile
  | typeof formOnboardingCandidateSocialSituation
  | typeof formOnboardingCandidateAI;

export type CoachOnboardingForm =
  | typeof formOnboardingEthicsCharter
  | typeof formOnboardingCoachNudges
  | typeof formOnboardingCoachJob
  | typeof formOnboardingCoachProfile;

export type CompanyOnboardingForm =
  | typeof formOnboardingEthicsCharter
  | typeof formOnboardingCompanyGoal
  | typeof formOnboardingCompanyInformation;

export type OnboardingForms =
  | CandidateOnboardingForm
  | CoachOnboardingForm
  | CompanyOnboardingForm;

export type OnboardingFormData = ExtractFormSchemaValidation<OnboardingForms>;

export type OnboardingFormDataKeys = UnionKeys<OnboardingFormData>;

export type FlattenedOnboardingFormData =
  UnionToIntersection<OnboardingFormData>;

export interface OnboardingStepContent<
  T extends OnboardingForms = OnboardingForms
> {
  title: string;
  subtitle?: React.ReactNode;
  content?: React.ReactNode;
  form: T;
  // Used to get the values of a previous step as default values in the form of the current step
  dependsOn?: OnboardingFormDataKeys[];
  // Used to skip the step if the value of a previous step matches the value in skippedBy
  skippedBy?: (user: User) => boolean;
  defaultValues?: (user: User) => Partial<OnboardingFormData>;
}

// Type pour chaque étape de l'onboarding candidat
export type CandidateOnboardingStepContents = {
  [K in OnboardingStep]?: OnboardingStepContent<CandidateOnboardingForm>;
};

// Type pour chaque étape de l'onboarding coach
export type CoachOnboardingStepContents = {
  [K in OnboardingStep]?: OnboardingStepContent<CoachOnboardingForm>;
};

// Type pour chaque étape de l'onboarding entreprise
export type CompanyOnboardingStepContents = {
  [K in OnboardingStep]?: OnboardingStepContent<CompanyOnboardingForm>;
};

export type OnboardingStepContentByFlow = Partial<{
  [OnboardingFlow.CANDIDATE]: OnboardingStepContent<CandidateOnboardingForm>;
  [OnboardingFlow.COACH]: OnboardingStepContent<CoachOnboardingForm>;
  [OnboardingFlow.COMPANY]: OnboardingStepContent<CompanyOnboardingForm>;
}>;

export interface CompanyStepData {
  description?: string;
  logo?: File[];
  businessSectorIds?: { value: string }[];
  department?: { value: string };
  url?: string;
  linkedinUrl?: string;
  hiringUrl?: string;
  goal?: string[];
}

export interface CandidateCoachStepData {
  externalCv?: File[];
  nationality?: string;
  accommodation?: string;
  hasSocialWorker?: boolean;
  resources?: string;
  studiesLevel?: string;
  workingExperience?: string;
  jobSearchDuration?: string;
}

// Type représentant la structure de données complète pour l'onboarding
export type OnboardingStepData = {
  [step: number]: { [flow in OnboardingFlow]?: OnboardingFormData };
};

export const OnboardingErrorMessages = {
  CURRENT_STEP: 'Onboarding current step is not set',
  STEP_CONTENT:
    'Onboarding step content was not found. You should add content for this step.',
  SELECTED_ROLE: 'Onboarding selected role is not set',
};
