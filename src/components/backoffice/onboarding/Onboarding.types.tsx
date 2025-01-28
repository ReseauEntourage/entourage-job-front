import React from 'react';
import { User } from '../../../api/types';
import {
  getCandidateDefaultProfessionalValues,
  getCoachDefaultProfessionalValues,
} from '../parametres/ParametresLayout/ProfessionalInformationCard/ProfessionalInformationCard.utils';
import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import { isReadDocument } from 'src/components/partials/pages/Documents/Documents.utils';
import { EthicsCharter } from 'src/components/utils/EthicsCharter/EthicsCharter';
import { DocumentNames } from 'src/constants';
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

export const onboardingAlreadyCompleted = {
  [USER_ROLES.CANDIDATE]: (user: User) => {
    const userProfileRequired = ['description'];
    const userProfileCompleted = userProfileRequired.every((field) =>
      Boolean(user.userProfile[field])
    );
    const readDocumentCompleted = isReadDocument(
      user.readDocuments,
      DocumentNames.CharteEthique
    );
    return userProfileCompleted && readDocumentCompleted;
  },
  [USER_ROLES.COACH]: (user: User) => {
    const userProfileRequired = ['description'];
    const userProfileCompleted = userProfileRequired.every((field) =>
      Boolean(user.userProfile[field])
    );
    const readDocumentCompleted = isReadDocument(
      user.readDocuments,
      DocumentNames.CharteEthique
    );
    return userProfileCompleted && readDocumentCompleted;
  },
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
  skippedBy?: (user: User) => boolean;
  defaultValues?: (user: User) => Partial<OnboardingFormData>;
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
      skippedBy: (user: User) => {
        return isReadDocument(user.readDocuments, DocumentNames.CharteEthique);
      },
      content: <EthicsCharter />,
      form: formOnboardingEthicsCharter,
      defaultValues: (user) => ({
        hasAcceptEthicsCharter: isReadDocument(
          user.readDocuments,
          DocumentNames.CharteEthique
        ),
      }),
    },
    [USER_ROLES.COACH]: {
      title: 'Charte éthique',
      skippedBy: (user: User) => {
        return isReadDocument(user.readDocuments, DocumentNames.CharteEthique);
      },
      content: <EthicsCharter />,
      form: formOnboardingEthicsCharter,
      defaultValues: (user) => ({
        hasAcceptEthicsCharter: isReadDocument(
          user.readDocuments,
          DocumentNames.CharteEthique
        ),
      }),
    },
  },
  2: {
    [USER_ROLES.CANDIDATE]: {
      title: 'Complétez votre profil',
      subtitle:
        "Pour répondre au mieux à vos attentes, nous avons besoin d'en savoir un petit plus sur vous",
      form: formOnboardingCandidateProfile,
      content: <OnboardingProfileForm />,
      defaultValues: (user) => ({
        description: user.userProfile.description ?? undefined,
      }),
      skippedBy: ({ userProfile }: User) => !!userProfile.description,
    },
    [USER_ROLES.COACH]: {
      title: 'Complétez votre profil',
      subtitle:
        "Pour répondre au mieux à vos attentes, nous avons besoin d'en savoir un petit plus sur vous",
      form: formOnboardingCoachProfile,
      defaultValues: (user) => ({
        description: user.userProfile.description ?? undefined,
      }),
      skippedBy: ({ userProfile }: User) => !!userProfile.description,
    },
  },
  3: {
    [USER_ROLES.CANDIDATE]: {
      title: 'Dites-nous en plus sur votre activité professionnelle',
      form: formOnboardingCandidateJob,
      defaultValues: (user) => {
        return getCandidateDefaultProfessionalValues(user.userProfile);
      },
      skippedBy: ({ userProfile }: User) => !!userProfile.hasExternalCv,
    },
    [USER_ROLES.COACH]: {
      title: 'Complétez votre profil',
      subtitle:
        "Pour répondre au mieux à vos attentes, nous avons besoin d'en savoir un petit plus sur vous",
      form: formOnboardingCoachJob,
      defaultValues: (user) => {
        return getCoachDefaultProfessionalValues(user.userProfile);
      },
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
