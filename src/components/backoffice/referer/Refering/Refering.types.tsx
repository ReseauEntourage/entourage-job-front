import React from 'react';
import { formReferingAccountReferedCandidate } from '../forms/formReferingAccountReferedCandidate';
import { formReferingExpectations } from '../forms/formReferingExpectations';
import { formReferingInfo } from '../forms/formReferingInfo';
import { formReferingInfoCo } from '../forms/formReferingInfoCo';
import { formReferingProfessionalInformation } from '../forms/formReferingProfessionalInformation';
import { formReferingProgram } from '../forms/formReferingProgram';
import { formReferingSocialSituation } from '../forms/formReferingSocialSituation';
import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import { CandidateLastStepContent } from 'src/components/registration/Registration.types';
import { Alert } from 'src/components/utils/Alert';
import { Text } from 'src/components/utils/Text';
import { Programs } from 'src/constants/programs';
import { UnionKeys, UnionToIntersection } from 'src/utils/Types';

export type ReferingStep = `step-${number}`;
export const REFERING_FIRST_STEP = 'step-1' as const;
export const REFERING_CONFIRMATION_STEP = 'confirmation' as const;

export type ReferingForms =
  | typeof formReferingAccountReferedCandidate
  | typeof formReferingExpectations
  | typeof formReferingInfo
  | typeof formReferingProgram
  | typeof formReferingInfoCo
  | typeof formReferingProfessionalInformation
  | typeof formReferingSocialSituation;

export type ReferingFormData = ExtractFormSchemaValidation<ReferingForms>;

export type ReferingFormDataKeys = UnionKeys<ReferingFormData>;

export type FlattenedReferingFormData = UnionToIntersection<ReferingFormData>;

export type SkippedByKeys = Partial<
  {
    [K in ReferingFormDataKeys]: FlattenedReferingFormData[K];
  } & {
    notEligibleFor360?: boolean;
  }
>;
export type SkippedByKeysUnion = UnionKeys<SkippedByKeys>;

const ReferingLabels = {
  MULTIPLE_CHOICE: 'Plusieurs choix possible',
  SINGLE_CHOICE: 'Sélectionnez une des options',
  FUTURE_CHANGE: 'Vous pourrez modifier votre choix à tout moment',
} as const;

export type ReferingLabel =
  (typeof ReferingLabels)[keyof typeof ReferingLabels];

export interface ReferingStepContent {
  subtitle?: React.ReactNode;
  annotation?: ReferingLabel;
  form: ReferingForms;
  // Used to get the values of a previous step as default values in the form of the current step
  dependsOn?: ReferingFormDataKeys[];
  // Used to skip the step if the value of a previous step matches the value in skippedBy
  skippedBy?: SkippedByKeys;
}

export const ReferingStepContents: {
  [K in ReferingStep]: ReferingStepContent;
} = {
  'step-1': {
    form: formReferingAccountReferedCandidate,
  },
  'step-2': {
    form: formReferingExpectations,
    subtitle:
      'Quelles sont les attentes de votre candidats en rejoignant Entourage Pro ?',
    annotation: ReferingLabels.MULTIPLE_CHOICE,
  },
  'step-3': {
    form: formReferingInfo,
  },
  'step-4': {
    form: formReferingProgram,
    dependsOn: ['department', 'birthDate'],
    skippedBy: {
      notEligibleFor360: true,
    },
  },
  'step-5': {
    subtitle:
      "Et si on se rencontrait ? Choisissez une date d'information collective",
    form: formReferingInfoCo,
    dependsOn: ['department', 'program'],
    skippedBy: {
      program: [Programs.BOOST],
    },
  },
  'step-6': {
    form: formReferingProfessionalInformation,
    subtitle:
      'Nous aimerions en savoir un peu plus sur la situation du candidat',
  },
  'step-7': {
    form: formReferingSocialSituation,
    subtitle: (
      <>
        Nous aimerions en savoir un peu plus sur votre situation. <br />
        <br />
        <Alert>
          <Text weight="bold">
            Ces informations sont confidentielles, optionnelles et ne seront pas
            communiquées.
          </Text>
        </Alert>
      </>
    ),
  },
};

export const ReferingErrorMessages = {
  CURRENT_STEP: 'Refering current step is not set',
  STEP_CONTENT:
    'Refering step content was not found. You should add content for this step.',
};

export type ReferingStepData = Partial<{
  [K in number]: ExtractFormSchemaValidation<ReferingForms>;
}>;

export type ReferingLastStepContent = {
  title: string;
  subtitle: string;
  bullets: {
    icon: React.ReactNode;
    title: string;
    text: string;
  }[];
};

export const LastStepContent: ReferingLastStepContent = {
  // By default it's the same as the candidate last step content (from classic registration)
  ...CandidateLastStepContent,
  title:
    "Vous venez de pré-inscrire votre candidat, il doit maintenant cliquer sur le lien d'activation que nous avons envoyé à son adresse e-mail pour accéder au réseau Entourage Pro !",
  subtitle: 'Voici les fonctionnalités auxquelles votre candidat aura accès',
};
