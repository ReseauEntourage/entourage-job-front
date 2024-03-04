import { formOnboardingRole } from '../forms/formOnboardingRole';
import { USER_ROLES } from 'src/constants/users';

export type OnboardingStep = `step-${number}`;

export const OnboardingSteps: { [K in 'FIRST' | 'LAST']: OnboardingStep } = {
  FIRST: `step-1`,
  LAST: `step-1`,
};

type RoleStepData = {
  role: (typeof USER_ROLES.CANDIDATE | typeof USER_ROLES.COACH)[];
};

export type StepData = RoleStepData; /* TODO Add other steps types here */

export type StepsData = {
  [K in OnboardingStep]: StepData;
};

const OnboardingLabels = {
  MULTIPLE_CHOICE_LABEL: 'Plusieurs choix possible',
  FUTURE_CHANGE: 'Vous pourrez modifier votre choix à tout moment',
} as const;

export type OnboardingLabel =
  (typeof OnboardingLabels)[keyof typeof OnboardingLabels];

export type OnboardingForms =
  | typeof formOnboardingRole; /* TODO Add other steps forms here */

export interface OnboardingPageContent {
  subtitle: string;
  annotation?: OnboardingLabel;
  form: OnboardingForms;
}

export const OnboardingPageContents: {
  [K in OnboardingStep]: OnboardingPageContent;
} = {
  'step-1': {
    subtitle: 'Faisons connaissance : quelle est votre situation actuelle ?',
    form: formOnboardingRole,
  },
  /* TODO add other steps contents here */
};
