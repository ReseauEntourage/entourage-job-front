import React from 'react';
import { UnionKeys, UnionToIntersection } from '@/src/utils/Types';
import { ExtractFormSchemaValidation } from '../forms/FormSchema';
import { RegistrationFlow } from './flows/flows.types';
import { formRegistrationAccount } from './forms/formRegistrationAccount';
import { formRegistrationCandidateEconomicSocialInformation } from './forms/formRegistrationCandidateEconomicSocialInformation';
import { formRegistrationCandidateExpectations } from './forms/formRegistrationCandidateExpectations';
import { formRegistrationCandidateInfo } from './forms/formRegistrationCandidateInfo';
import { formRegistrationCoachInfo } from './forms/formRegistrationCoachInfo';
import { formRegistrationCompanyRole } from './forms/formRegistrationCompanyRole';
import { formRegistrationCompanySelection } from './forms/formRegistrationCompanySelection';
import { formRegistrationFlowSelection } from './forms/formRegistrationFlowSelection';
import { formRegistrationRefererAccount } from './forms/formRegistrationRefererAccount';

export type RegistrationStep = number;

export enum RegistrationStepAnnotation {
  MULTIPLE_CHOICE = 'Plusieurs choix possible',
  SINGLE_CHOICE = 'Sélectionnez une des options',
  FUTURE_CHANGE = 'Vous pourrez modifier votre choix à tout moment',
}

export type CandidateRegistrationFlowForm =
  | typeof formRegistrationCandidateExpectations
  | typeof formRegistrationCandidateInfo
  | typeof formRegistrationCandidateEconomicSocialInformation
  | typeof formRegistrationAccount;

export type CoachRegistrationFlowForm =
  | typeof formRegistrationCoachInfo
  | typeof formRegistrationAccount;

export type RefererRegistrationFlowForm = typeof formRegistrationRefererAccount;

export type CompanyRegistrationFlowForm =
  | typeof formRegistrationCompanyRole
  | typeof formRegistrationCompanySelection
  | typeof formRegistrationCoachInfo
  | typeof formRegistrationAccount;

export type FirstStepRegistrationForm = typeof formRegistrationFlowSelection;

/**
 * Represents the forms used in the registration flow.
 */
export type RegistrationFlowForms =
  | FirstStepRegistrationForm
  | CandidateRegistrationFlowForm
  | CoachRegistrationFlowForm
  | RefererRegistrationFlowForm
  | CompanyRegistrationFlowForm;

export type RegistrationFlowFormWithOrganizationField =
  typeof formRegistrationRefererAccount;

export type RegistrationFlowFormWithCompanyField =
  | typeof formRegistrationCompanySelection;

export type RegistrationFormData =
  ExtractFormSchemaValidation<RegistrationFlowForms>;

export type FirstStepRegistrationFormData = ExtractFormSchemaValidation<
  typeof formRegistrationFlowSelection
>;

export type RegistrationFormDataKeys = UnionKeys<RegistrationFormData>;

export type RegistrationData = UnionToIntersection<RegistrationFormData> | null;

/**
 * Represents the skipped keys in the registration form data.
 * This type is used to define which keys can be skipped based on the values of other fields
 */
export type SkippedByKeys = Partial<RegistrationData>;
export type SkippedByKeysUnion = UnionKeys<SkippedByKeys>;

export interface RegistrationStepContent<
  T extends RegistrationFlowForms = RegistrationFlowForms
> {
  subtitle?: React.ReactNode;
  annotation?: RegistrationStepAnnotation;
  form: T;
  // Used to get the values of a previous step as default values in the form of the current step
  dependsOn?: RegistrationFormDataKeys[];
  // Used to skip the step if the value of a previous step matches the value in skippedBy
  skippedBy?: SkippedByKeys;
  // Used to add a custom submit handler to the form (called by the def)
  customDispatch?: (stepData: RegistrationFormData) => Partial<{
    flow: RegistrationFlow;
    nextStep: RegistrationStep;
    data: RegistrationData;
  }> | void;
}

export interface RegistrationLastStepContent {
  title: string;
  subtitle: string;
  bullets: {
    icon: React.ReactNode;
    title: string;
    text: string;
  }[];
}

export type RegistrationLastStepContentByFlow = Partial<{
  [K in RegistrationFlow]: RegistrationLastStepContent;
}>;
