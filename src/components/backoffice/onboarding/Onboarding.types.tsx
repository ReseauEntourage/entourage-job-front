import React from 'react';
import { UserProfile } from '../../../api/types';
import {
  getCandidateDefaultProfessionalValues,
  getCoachDefaultProfessionalValues,
} from '../parametres/ParametresLayout/ProfessionalInformationCard/ProfessionalInformationCard.utils';
import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import { EthicsCharter } from 'src/components/utils/EthicsCharter/EthicsCharter';
import { USER_ROLES } from 'src/constants/users';
import { UnionKeys, UnionToIntersection } from 'src/utils/Types';
import { OnboardingProfileForm } from './Onboarding/forms/OnboardingProfileForm';
import { formOnboardingCandidateHelps } from './Onboarding/forms/schemas/formOnboardingCandidateHelps';
import { formOnboardingCandidateJob } from './Onboarding/forms/schemas/formOnboardingCandidateJob';
import { formOnboardingCandidateProfile } from './Onboarding/forms/schemas/formOnboardingCandidateProfile';
import { formOnboardingCoachHelps } from './Onboarding/forms/schemas/formOnboardingCoachHelps';
import { formOnboardingCoachJob } from './Onboarding/forms/schemas/formOnboardingCoachJob';
import { formOnboardingCoachProfile } from './Onboarding/forms/schemas/formOnboardingCoachProfile';
import { formOnboardingEthicsCharter } from './Onboarding/forms/schemas/formOnboardingEthicsCharter';

export type OnboardingStep = 0 | 1 | 2 | 3; // 0 means no onboarding
export const ONBOARDING_FIRST_STEP = 1 as OnboardingStep;
export const ONBOARDING_LAST_STEP = 3 as OnboardingStep;

export type CandidateOnboardingForm =
  | typeof formOnboardingEthicsCharter
  | typeof formOnboardingCandidateHelps
  | typeof formOnboardingCandidateJob
  | typeof formOnboardingCandidateProfile;

export type CoachOnboardingForm =
  | typeof formOnboardingEthicsCharter
  | typeof formOnboardingCoachHelps
  | typeof formOnboardingCoachJob
  | typeof formOnboardingCoachProfile;

export type OnboardingForms = CandidateOnboardingForm | CoachOnboardingForm;

export type OnboardingFormData = ExtractFormSchemaValidation<OnboardingForms>;

export type OnboardingFormDataKeys = UnionKeys<OnboardingFormData>;

export type FlattenedOnboardingFormData =
  UnionToIntersection<OnboardingFormData>;

export const fieldRequiredToNotLaunchOnboarding = {
  [USER_ROLES.CANDIDATE]: [
    'hasAcceptEthicsCharter',
    'description',
    'hasExternalCv',
  ],
  [USER_ROLES.COACH]: ['hasAcceptEthicsCharter', 'description'],
};

const OnboardingLabels = {
  MULTIPLE_CHOICE: 'Plusieurs choix possible',
  SINGLE_CHOICE: 'Sélectionnez une des options',
  FUTURE_CHANGE: 'Vous pourrez modifier votre choix à tout moment',
} as const;

export type OnboardingLabel =
  (typeof OnboardingLabels)[keyof typeof OnboardingLabels];

export interface OnboardingStepContent<
  T extends OnboardingForms = OnboardingForms
> {
  title: string;
  subtitle?: React.ReactNode;
  annotation?: OnboardingLabel;
  content?: React.ReactNode;
  form: T;
  // Used to get the values of a previous step as default values in the form of the current step
  dependsOn?: OnboardingFormDataKeys[];
  // Used to skip the step if the value of a previous step matches the value in skippedBy
  skippedBy?: (userProfile: UserProfile) => boolean;
  defaultValues?: (userProfile: UserProfile) => Partial<OnboardingFormData>;
}

export type OnboardingStepContentByRole = Partial<{
  [USER_ROLES.CANDIDATE]: OnboardingStepContent<CandidateOnboardingForm>;
  [USER_ROLES.COACH]: OnboardingStepContent<CoachOnboardingForm>;
}>;

export const OnboardingStepContents: {
  [K in OnboardingStep]?: OnboardingStepContentByRole;
} = {
  1: {
    [USER_ROLES.CANDIDATE]: {
      title: 'Charte éthique',
      skippedBy: ({ hasAcceptEthicsCharter }: UserProfile) =>
        hasAcceptEthicsCharter === true,
      content: <EthicsCharter />,
      form: formOnboardingEthicsCharter,
      defaultValues: (userProfile) => ({
        hasAcceptEthicsCharter: userProfile.hasAcceptEthicsCharter ?? undefined,
      }),
    },
    [USER_ROLES.COACH]: {
      title: 'Charte éthique',
      skippedBy: ({ hasAcceptEthicsCharter }: UserProfile) =>
        hasAcceptEthicsCharter === true,
      content: <EthicsCharter />,
      form: formOnboardingEthicsCharter,
      defaultValues: (userProfile) => ({
        hasAcceptEthicsCharter: userProfile.hasAcceptEthicsCharter ?? undefined,
      }),
    },
  },
  // TODO: Add social questions
  2: {
    [USER_ROLES.CANDIDATE]: {
      title: 'Complétez votre profil',
      subtitle:
        "Pour répondre au mieux à vos attentes, nous avons besoin d'en savoir un petit plus sur vous",
      form: formOnboardingCandidateProfile,
      content: <OnboardingProfileForm />,
      defaultValues: (userProfile: UserProfile) => ({
        description: userProfile.description ?? undefined,
      }),
      skippedBy: ({ description }: UserProfile) => !!description,
    },
    [USER_ROLES.COACH]: {
      title: 'Complétez votre profil',
      subtitle:
        "Pour répondre au mieux à vos attentes, nous avons besoin d'en savoir un petit plus sur vous",
      form: formOnboardingCoachProfile,
      defaultValues: (userProfile: UserProfile) => ({
        description: userProfile.description ?? undefined,
      }),
      skippedBy: ({ description }: UserProfile) => !!description,
    },
  },
  3: {
    [USER_ROLES.CANDIDATE]: {
      title: 'Dites-nous en plus sur votre activité professionnelle',
      form: formOnboardingCandidateJob,
      defaultValues: getCandidateDefaultProfessionalValues,
      skippedBy: ({ hasExternalCv }: UserProfile) => !!hasExternalCv,
    },
    [USER_ROLES.COACH]: {
      title: 'Complétez votre profil',
      subtitle:
        "Pour répondre au mieux à vos attentes, nous avons besoin d'en savoir un petit plus sur vous",
      form: formOnboardingCoachJob,
      defaultValues: getCoachDefaultProfessionalValues,
    },
  },
};

export type OnboardingStepDataByRole = Partial<{
  [USER_ROLES.CANDIDATE]: ExtractFormSchemaValidation<CandidateOnboardingForm>;
  [USER_ROLES.COACH]: ExtractFormSchemaValidation<CoachOnboardingForm>;
}>;

export type OnboardingStepData = Partial<{
  [K in OnboardingStep]: Partial<OnboardingFormData>;
}>;

export const OnboardingErrorMessages = {
  CURRENT_STEP: 'Onboarding current step is not set',
  STEP_CONTENT:
    'Onboarding step content was not found. You should add content for this step.',
  SELECTED_ROLE: 'Onboarding selected role is not set',
};
