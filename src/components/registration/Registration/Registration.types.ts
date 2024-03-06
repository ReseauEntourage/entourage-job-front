import { ExtractFormSchemaValidation } from '../../forms/FormSchema';
import { USER_ROLES } from 'src/constants/users';
import { FlattenUnionToOptionalIntersection, UnionKeys } from 'src/utils/Types';
import { formRegistrationCandidateExpectations } from './forms/formRegistrationCandidateExpectations';
import { formRegistrationCandidateInfo } from './forms/formRegistrationCandidateInfo';
import { formRegistrationCandidateInfoCo } from './forms/formRegistrationCandidateInfoCo';
import { formRegistrationCandidateProgram } from './forms/formRegistrationCandidateProgram';
import { formRegistrationCoachInfo } from './forms/formRegistrationCoachInfo';
import { formRegistrationCoachProgram } from './forms/formRegistrationCoachProgram';
import { formRegistrationRole } from './forms/formRegistrationRole';

export type RegistrationStep = `step-${number}`;
export const REGISTRATION_FIRST_STEP = 'step-1' as const;

export type CandidateRegistrationForm =
  | typeof formRegistrationCandidateExpectations
  | typeof formRegistrationCandidateInfo
  | typeof formRegistrationCandidateProgram
  | typeof formRegistrationCandidateInfoCo;
/* TODO Add other steps forms here */

export type CoachRegistrationForm =
  | typeof formRegistrationCoachInfo
  | typeof formRegistrationCoachProgram;
/* TODO Add other steps forms here */

export type FirstStepRegistrationForm = typeof formRegistrationRole;

export type RegistrationForms =
  | FirstStepRegistrationForm
  | CandidateRegistrationForm
  | CoachRegistrationForm;

export type StepData = ExtractFormSchemaValidation<RegistrationForms>;

export type StepDataKeys = UnionKeys<StepData>;

export type FlattenedStepData = FlattenUnionToOptionalIntersection<StepData>;

export type FirstStepData =
  ExtractFormSchemaValidation<FirstStepRegistrationForm>;

export type RegistrationStepDataByRole = Partial<{
  [USER_ROLES.CANDIDATE]: ExtractFormSchemaValidation<CandidateRegistrationForm>;
  [USER_ROLES.COACH]: ExtractFormSchemaValidation<CoachRegistrationForm>;
}>;

export type RegistrationStepData = Partial<{
  [K in RegistrationStep]: RegistrationStepDataByRole;
}>;

const RegistrationLabels = {
  MULTIPLE_CHOICE: 'Plusieurs choix possible',
  SINGLE_CHOICE: 'Sélectionnez une des deux options',
  FUTURE_CHANGE: 'Vous pourrez modifier votre choix à tout moment',
} as const;

export type RegistrationLabel =
  (typeof RegistrationLabels)[keyof typeof RegistrationLabels];

export interface RegistrationStepContent<
  T extends RegistrationForms = RegistrationForms
> {
  subtitle?: string;
  annotation?: RegistrationLabel;
  form: T;
  dependsOn?: StepDataKeys[];
}

export type RegistrationStepContentByRole = Partial<{
  [USER_ROLES.CANDIDATE]: RegistrationStepContent<CandidateRegistrationForm>;
  [USER_ROLES.COACH]: RegistrationStepContent<CoachRegistrationForm>;
}>;

export const FirstStepContent: RegistrationStepContent<FirstStepRegistrationForm> =
  {
    subtitle: 'Faisons connaissance : quelle est votre situation actuelle ?*',
    form: formRegistrationRole,
    annotation: RegistrationLabels.SINGLE_CHOICE,
  };

export const RegistrationStepContents: {
  [K in RegistrationStep]: RegistrationStepContentByRole;
} = {
  'step-2': {
    [USER_ROLES.CANDIDATE]: {
      subtitle: 'Quelles sont vos attentes en rejoignant Entourage Pro ?*',
      form: formRegistrationCandidateExpectations,
      annotation: RegistrationLabels.MULTIPLE_CHOICE,
    },
    [USER_ROLES.COACH]: {
      form: formRegistrationCoachInfo,
    },
  },
  'step-3': {
    [USER_ROLES.CANDIDATE]: {
      form: formRegistrationCandidateInfo,
    },
    [USER_ROLES.COACH]: {
      subtitle: "Choisissez le type d'accompagnement qui vous correspond",
      annotation: RegistrationLabels.FUTURE_CHANGE,
      form: formRegistrationCoachProgram,
    },
  },
  'step-4': {
    [USER_ROLES.CANDIDATE]: {
      subtitle: "Choisissez le type d'accompagnement qui vous correspond",
      annotation: RegistrationLabels.FUTURE_CHANGE,
      form: formRegistrationCandidateProgram,
    },
  },
  'step-5': {
    [USER_ROLES.CANDIDATE]: {
      subtitle:
        "Et si on se rencontrait ? Choisissez une date d'information collective",
      form: formRegistrationCandidateInfoCo,
      dependsOn: ['department'],
    },
  },
  /* TODO add other steps contents here */
};

export const RegistrationErrorMessages = {
  CURRENT_STEP: 'Registration current step is not set',
  SELECTED_ROLE: 'Registration selected role is not set',
};
