import { formRegistrationCandidateExpectations } from '../forms/formRegistrationCandidateExpectations';
import { formRegistrationRole } from '../forms/formRegistrationRole';
import { HelpValue } from 'src/constants/helps';
import { NormalUserRole, USER_ROLES } from 'src/constants/users';

export type RegistrationStep = `step-${number}`;
export const REGISTRATION_FIRST_STEP = 'step-1' as const;

type RoleStepData = {
  role: NormalUserRole[];
};

type CandidateExpectationsStepData = {
  expectations: HelpValue[];
};

export type AllStepData =
  | RoleStepData
  | CandidateExpectationsStepData; /* TODO Add other steps data here */

export type FirstStepData = RoleStepData;

type RegistrationStepDataByRole = Partial<{
  [USER_ROLES.CANDIDATE]: CandidateExpectationsStepData;
  /*  [USER_ROLES.COACH]:  */
}>;

export type RegistrationStepData = Partial<{
  [K in RegistrationStep]: RegistrationStepDataByRole;
}>;

const RegistrationLabels = {
  MULTIPLE_CHOICE_LABEL: 'Plusieurs choix possible',
  FUTURE_CHANGE: 'Vous pourrez modifier votre choix à tout moment',
} as const;

export type RegistrationLabel =
  (typeof RegistrationLabels)[keyof typeof RegistrationLabels];

export type RegistrationForms =
  | typeof formRegistrationRole
  | typeof formRegistrationCandidateExpectations; /* TODO Add other steps forms here */

export interface RegistrationStepContent {
  subtitle: string;
  annotation?: RegistrationLabel;
  form: RegistrationForms;
}

export type RegistrationStepContentByRole = Partial<{
  [K in NormalUserRole]: RegistrationStepContent;
}>;

export const FirstStepContent: RegistrationStepContent = {
  subtitle: 'Faisons connaissance : quelle est votre situation actuelle ?*',
  form: formRegistrationRole,
};

export const RegistrationStepContents: {
  [K in RegistrationStep]: RegistrationStepContentByRole;
} = {
  'step-2': {
    [USER_ROLES.CANDIDATE]: {
      subtitle: 'Quelles sont vos attentes en rejoignant Entourage Pro ?*',
      form: formRegistrationCandidateExpectations,
      annotation: RegistrationLabels.MULTIPLE_CHOICE_LABEL,
    },
  },
  /* TODO add other steps contents here */
};
