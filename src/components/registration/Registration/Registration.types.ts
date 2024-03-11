import { formRegistrationRole } from '../forms/formRegistrationRole';
import { NormalUserRole } from 'src/constants/users';

export type RegistrationStep = `step-${number}`;
export const REGISTRATION_FIRST_STEP = 'step-1' as const;

type FirstStepData = {
  role: NormalUserRole[];
};

/* type RestStepData = {
  [K in NormalUserRole]: {};
}; */

export type StepData = FirstStepData; /* RestStepData */
/* TODO Add other steps types here */

export type StepsData = {
  [K in RegistrationStep]: StepData;
};

const RegistrationLabels = {
  MULTIPLE_CHOICE_LABEL: 'Plusieurs choix possible',
  FUTURE_CHANGE: 'Vous pourrez modifier votre choix à tout moment',
} as const;

export type RegistrationLabel =
  (typeof RegistrationLabels)[keyof typeof RegistrationLabels];

export type RegistrationForms =
  typeof formRegistrationRole; /* TODO Add other steps forms here */

export interface RegistrationPageContent {
  subtitle: string;
  annotation?: RegistrationLabel;
  form: RegistrationForms;
}

export type RegistrationPageContentByRole = {
  [K in NormalUserRole]: RegistrationPageContent;
};

export const RegistrationPageContents:
  | {
      [REGISTRATION_FIRST_STEP]: RegistrationPageContent;
    }
  | {
      [K in RegistrationStep]: RegistrationPageContentByRole;
    } = {
  'step-1': {
    subtitle: 'Faisons connaissance : quelle est votre situation actuelle ?',
    form: formRegistrationRole,
  },
  /* TODO add other steps contents here */
};
