import { formEditCatchphrase } from 'src/components/forms/schemas/formEditCatchphrase';
import { USER_ROLES } from 'src/constants/users';
import { formOnboardingRole } from './forms/formOnboardingRole';

export type OnboardingStep = `step-${number}`;

export const OnboardingSteps: { [K in 'FIRST' | 'LAST']: OnboardingStep } = {
  FIRST: `step-1`,
  LAST: `step-1`,
};

type RoleStepData = {
  role: (typeof USER_ROLES.CANDIDATE | typeof USER_ROLES.COACH)[];
};

export type StepsData = {
  [K in OnboardingStep]: RoleStepData /* TODO Add other steps types here */;
};

const OnboardingLabels = {
  MULTIPLE_CHOICE_LABEL: 'Plusieurs choix possible',
  FUTURE_CHANGE: 'Vous pourrez modifier votre choix à tout moment',
} as const;

export type OnboardingLabel =
  (typeof OnboardingLabels)[keyof typeof OnboardingLabels];

type OnboardingForms = typeof formOnboardingRole | typeof formEditCatchphrase;

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
