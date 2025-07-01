import React from 'react';
import { User } from '../../../api/types';
import {
  getCandidateDefaultProfessionalValues,
  getCoachDefaultProfessionalValuesWithLinkedIn,
} from '../parametres-old/ParametresLayout/ProfessionalInformationCard/ProfessionalInformationCard.utils';
import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import { isReadDocument } from 'src/components/partials/pages/Documents/Documents.utils';
import { EthicsCharter } from 'src/components/utils/EthicsCharter/EthicsCharter';
import { DocumentNames } from 'src/constants';
import { UserRoles } from 'src/constants/users';
import { UnionKeys, UnionToIntersection } from 'src/utils/Types';
import { OnboardingAI } from './Onboarding/forms/OnboardingAI';
import { OnboardingCandidateSocialSituation } from './Onboarding/forms/OnboardingCandidateSocialSituation';
import { OnboardingProfileForm } from './Onboarding/forms/OnboardingProfileForm';
import { formOnboardingCandidateAI } from './Onboarding/forms/schemas/formOnboardingCandidateAI';
import { formOnboardingCandidateHelps } from './Onboarding/forms/schemas/formOnboardingCandidateHelps';
import { formOnboardingCandidateJob } from './Onboarding/forms/schemas/formOnboardingCandidateJob';
import { formOnboardingCandidateProfile } from './Onboarding/forms/schemas/formOnboardingCandidateProfile';
import { formOnboardingCandidateSocialSituation } from './Onboarding/forms/schemas/formOnboardingCandidateSocialSituation';
import { formOnboardingCoachHelps } from './Onboarding/forms/schemas/formOnboardingCoachHelps';
import { formOnboardingCoachJob } from './Onboarding/forms/schemas/formOnboardingCoachJob';
import { formOnboardingCoachProfile } from './Onboarding/forms/schemas/formOnboardingCoachProfile';
import { formOnboardingEthicsCharter } from './Onboarding/forms/schemas/formOnboardingEthicsCharter';

export type OnboardingStep = 0 | 1 | 2 | 3 | 4 | 5; // 0 means no onboarding
export const ONBOARDING_FIRST_STEP = 1 as OnboardingStep;
export const ONBOARDING_LAST_STEP = {
  [UserRoles.CANDIDATE]: 5 as OnboardingStep,
  [UserRoles.COACH]: 4 as OnboardingStep,
};

export type CandidateOnboardingForm =
  | typeof formOnboardingEthicsCharter
  | typeof formOnboardingCandidateHelps
  | typeof formOnboardingCandidateJob
  | typeof formOnboardingCandidateProfile
  | typeof formOnboardingCandidateSocialSituation
  | typeof formOnboardingCandidateAI;

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

export type OnboardingStepContentByRole = Partial<{
  [UserRoles.CANDIDATE]: OnboardingStepContent<CandidateOnboardingForm>;
  [UserRoles.COACH]: OnboardingStepContent<CoachOnboardingForm>;
}>;

export const OnboardingStepContents: {
  [K in OnboardingStep]?: OnboardingStepContentByRole;
} = {
  1: {
    [UserRoles.CANDIDATE]: {
      title: 'Charte éthique',
      skippedBy: (user: User) => {
        return isReadDocument(user.readDocuments, DocumentNames.CharteEthique);
      },
      content: <EthicsCharter />,
      form: formOnboardingEthicsCharter,
      defaultValues: (user) => ({
        hasAcceptedEthicsCharter: isReadDocument(
          user.readDocuments,
          DocumentNames.CharteEthique
        ),
      }),
    },
    [UserRoles.COACH]: {
      title: 'Charte éthique',
      skippedBy: (user: User) => {
        return isReadDocument(user.readDocuments, DocumentNames.CharteEthique);
      },
      content: <EthicsCharter />,
      form: formOnboardingEthicsCharter,
      defaultValues: (user) => ({
        hasAcceptedEthicsCharter: isReadDocument(
          user.readDocuments,
          DocumentNames.CharteEthique
        ),
      }),
    },
  },
  2: {
    [UserRoles.CANDIDATE]: {
      title: 'Nous aimerions en savoir plus sur votre situation',
      content: <OnboardingCandidateSocialSituation />,
      skippedBy: (user: User) => {
        // If the user as already accepted the ethics charter, we skip also the social situation form because it should be displayed only once
        return !!user.userSocialSituation?.hasCompletedSurvey;
      },
      form: formOnboardingCandidateSocialSituation,
      defaultValues: (user) => ({
        hasAcceptedEthicsCharter: isReadDocument(
          user.readDocuments,
          DocumentNames.CharteEthique
        ),
      }),
    },
    [UserRoles.COACH]: {
      title: 'Complétez votre profil',
      subtitle:
        "Pour répondre au mieux à vos attentes, nous avons besoin d'en savoir un petit plus sur ce que vous souhaitez apporter aux candidats",
      form: formOnboardingCoachHelps,
      defaultValues: (user) => ({
        nudgeIds: user.userProfile?.nudges?.map((nudge) => nudge.id) ?? [],
      }),
      skippedBy: (user: User) =>
        !!(user.userProfile?.nudges && user.userProfile?.nudges.length > 0),
    },
  },
  3: {
    [UserRoles.CANDIDATE]: {
      title: 'Complétez votre profil',
      subtitle:
        "Pour répondre au mieux à vos attentes, nous avons besoin d'en savoir un petit plus sur vous",
      form: formOnboardingCandidateProfile,
      content: <OnboardingProfileForm />,
      defaultValues: (user) => ({
        introduction: user.userProfile.introduction ?? undefined,
      }),
      skippedBy: ({ userProfile }: User) => !!userProfile.introduction,
    },
    [UserRoles.COACH]: {
      title: 'Complétez votre profil',
      subtitle:
        "Pour répondre au mieux à vos attentes, nous avons besoin d'en savoir un petit plus sur vous",
      form: formOnboardingCoachJob,
      defaultValues: (user) => {
        return getCoachDefaultProfessionalValuesWithLinkedIn(user.userProfile);
      },
      skippedBy: (user: User) =>
        !!(
          user.userProfile?.sectorOccupations &&
          user.userProfile?.sectorOccupations.length > 0
        ),
    },
  },
  4: {
    [UserRoles.CANDIDATE]: {
      title: 'Dites-nous en plus sur votre activité professionnelle',
      form: formOnboardingCandidateJob,
      defaultValues: (user) => {
        return getCandidateDefaultProfessionalValues(user.userProfile);
      },
      skippedBy: ({ userProfile }: User) => !!userProfile.hasExternalCv,
    },
    [UserRoles.COACH]: {
      title: 'Complétez votre profil',
      subtitle:
        "Pour répondre au mieux à vos attentes, nous avons besoin d'en savoir un petit plus sur vous",
      form: formOnboardingCoachProfile,
      content: <OnboardingProfileForm />,
      defaultValues: (user) => ({
        introduction: user.userProfile.introduction ?? undefined,
      }),
      skippedBy: ({ userProfile }: User) => !!userProfile.introduction,
    },
  },
  5: {
    [UserRoles.CANDIDATE]: {
      title: 'Enrichissez votre profil grâce à votre CV',
      content: <OnboardingAI />,
      form: formOnboardingCandidateAI,
      skippedBy: (user: User) =>
        !user.userProfile.hasExternalCv || !!user.hasExtractedCvData,
    },
  },
};

export type OnboardingStepDataByRole = Partial<{
  [UserRoles.CANDIDATE]: ExtractFormSchemaValidation<CandidateOnboardingForm>;
  [UserRoles.COACH]: ExtractFormSchemaValidation<CoachOnboardingForm>;
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
