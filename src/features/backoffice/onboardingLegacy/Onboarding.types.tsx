import React from 'react';
import { User } from '../../../api/types';
import { ExtractFormSchemaValidation } from 'src/features/forms/FormSchema';
import { UnionKeys, UnionToIntersection } from 'src/utils/Types';
import { formOnboardingCompanyGoal } from './Onboarding/forms/schemas/formOnboardingCompanyGoal';
import { formOnboardingCompanyInformation } from './Onboarding/forms/schemas/formOnboardingCompanyInformation';
import { formOnboardingEthicsCharter } from './Onboarding/forms/schemas/formOnboardingEthicsCharter';

export enum OnboardingFlow {
  COMPANY = 'COMPANY',
}

export type OnboardingStep = 0 | 1 | 2 | 3 | 4 | 5; // 0 means no onboarding
export const ONBOARDING_FIRST_STEP = 1 as OnboardingStep;

export type CompanyOnboardingForm =
  | typeof formOnboardingEthicsCharter
  | typeof formOnboardingCompanyGoal
  | typeof formOnboardingCompanyInformation;

export type OnboardingForms = CompanyOnboardingForm;

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

// Type pour chaque étape de l'onboarding entreprise
export type CompanyOnboardingStepContents = {
  [K in OnboardingStep]?: OnboardingStepContent<CompanyOnboardingForm>;
};

export type OnboardingStepContentByFlow = Partial<{
  [OnboardingFlow.COMPANY]: OnboardingStepContent<CompanyOnboardingForm>;
}>;

export interface CompanyStepData {
  description?: string;
  logo?: File[];
  businessSectorIds?: { value: string }[];
  departmentId?: { value: string };
  url?: string;
  linkedInUrl?: string;
  hiringUrl?: string;
  goal?: string[];
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
