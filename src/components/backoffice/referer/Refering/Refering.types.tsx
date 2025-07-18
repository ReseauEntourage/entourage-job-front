import React from 'react';
import { candidateLastStepBullets } from '@/src/components/registration/registration.config';
import { formReferingAccountReferedCandidate } from '../forms/formReferingAccountReferedCandidate';
import { formReferingExpectations } from '../forms/formReferingExpectations';
import { formReferingInfo } from '../forms/formReferingInfo';
import { formReferingProfessionalInformation } from '../forms/formReferingProfessionalInformation';
import { formReferingSocialSituation } from '../forms/formReferingSocialSituation';
import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import { UnionKeys, UnionToIntersection } from 'src/utils/Types';

export type ReferingStep = `step-${number}`;
export const REFERING_FIRST_STEP = 'step-1' as const;
export const REFERING_CONFIRMATION_STEP = 'confirmation' as const;

export type ReferingForms =
  | typeof formReferingAccountReferedCandidate
  | typeof formReferingExpectations
  | typeof formReferingInfo
  | typeof formReferingProfessionalInformation
  | typeof formReferingSocialSituation;

export type ReferingFormData = ExtractFormSchemaValidation<ReferingForms>;

export type ReferingFormDataKeys = UnionKeys<ReferingFormData>;

export type FlattenedReferingFormData = UnionToIntersection<ReferingFormData>;

export type SkippedByKeys = Partial<{
  [K in ReferingFormDataKeys]: FlattenedReferingFormData[K];
}>;
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
      'Quelles sont les attentes de votre candidat en rejoignant Entourage Pro ?',
    annotation: ReferingLabels.MULTIPLE_CHOICE,
  },
  'step-3': {
    form: formReferingInfo,
  },
  'step-4': {
    form: formReferingProfessionalInformation,
    subtitle:
      'Nous aimerions en savoir un peu plus sur la situation du candidat',
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
  bullets: candidateLastStepBullets,
  title:
    "Vous venez de pré-inscrire votre candidat, il doit maintenant cliquer sur le lien d'activation que nous avons envoyé à son adresse e-mail pour accéder au réseau Entourage Pro !",
  subtitle: 'Voici les fonctionnalités auxquelles votre candidat aura accès',
};
