import {
  CheckinExchangeFrequency,
  CheckinExchangeMode,
  CheckinPerceivedSupport,
  CheckinStillInTouch,
  CHECKIN_EXCHANGE_FREQUENCY_LABELS,
  CHECKIN_EXCHANGE_MODE_LABELS,
  CHECKIN_PERCEIVED_SUPPORT_LABELS,
  CHECKIN_STILL_IN_TOUCH_LABELS,
} from '@/src/constants/checkin';
import { UserRoles } from '@/src/constants/users';

export enum CheckinStepId {
  INTRO = 'INTRO',
  STILL_IN_TOUCH = 'STILL_IN_TOUCH',
  EXCHANGE_MODES = 'EXCHANGE_MODES',
  EXCHANGE_FREQUENCY = 'EXCHANGE_FREQUENCY',
  PERCEIVED_BENEFITS = 'PERCEIVED_BENEFITS',
  PERCEIVED_SUPPORT = 'PERCEIVED_SUPPORT',
  RATING = 'RATING',
  COMMENT = 'COMMENT',
  FINAL = 'FINAL',
}

// The 6 main questions shown in the progress bar. COMMENT and FINAL are not counted
// as extra steps: COMMENT is a conditional continuation of RATING, FINAL is the end.
export const CHECKIN_QUESTION_STEP_ORDER: CheckinStepId[] = [
  CheckinStepId.STILL_IN_TOUCH,
  CheckinStepId.EXCHANGE_MODES,
  CheckinStepId.EXCHANGE_FREQUENCY,
  CheckinStepId.PERCEIVED_BENEFITS,
  CheckinStepId.PERCEIVED_SUPPORT,
  CheckinStepId.RATING,
];

export const stillInTouchOptions = () =>
  Object.values(CheckinStillInTouch).map((value) => ({
    inputId: `checkin-still-in-touch-${value}`,
    value,
    label: CHECKIN_STILL_IN_TOUCH_LABELS[value],
  }));

export const exchangeModeOptions = () =>
  Object.values(CheckinExchangeMode).map((value) => ({
    value,
    label: CHECKIN_EXCHANGE_MODE_LABELS[value],
  }));

export const exchangeFrequencyOptions = () =>
  Object.values(CheckinExchangeFrequency).map((value) => ({
    inputId: `checkin-exchange-frequency-${value}`,
    value,
    label: CHECKIN_EXCHANGE_FREQUENCY_LABELS[value],
  }));

export const perceivedSupportOptions = () =>
  Object.values(CheckinPerceivedSupport).map((value) => ({
    inputId: `checkin-perceived-support-${value}`,
    value,
    label: CHECKIN_PERCEIVED_SUPPORT_LABELS[value],
  }));

const PERCEIVED_BENEFITS_TITLES: Record<UserRoles, string> = {
  [UserRoles.COACH]: 'Ce que ces échanges vous ont apporté :',
  [UserRoles.CANDIDATE]: 'Ce que ces échanges vous ont permis de...',
  [UserRoles.ADMIN]: 'Ce que ces échanges vous ont permis de...',
  [UserRoles.REFERER]: 'Ce que ces échanges vous ont permis de...',
};

const PERCEIVED_SUPPORT_TITLES: Record<
  UserRoles,
  (otherFirstName: string) => string
> = {
  [UserRoles.COACH]: (otherFirstName) =>
    `Avez-vous le sentiment d’être utile à ${otherFirstName} dans sa démarche ?`,
  [UserRoles.CANDIDATE]: () =>
    'Vous êtes-vous senti·e soutenu·e dans votre démarche ?',
  [UserRoles.ADMIN]: () =>
    'Vous êtes-vous senti·e soutenu·e dans votre démarche ?',
  [UserRoles.REFERER]: () =>
    'Vous êtes-vous senti·e soutenu·e dans votre démarche ?',
};

export const getQuestionTitle = (
  step: CheckinStepId,
  role: UserRoles,
  otherFirstName: string
): string => {
  switch (step) {
    case CheckinStepId.STILL_IN_TOUCH:
      return `Êtes-vous encore en lien avec ${otherFirstName} ?`;
    case CheckinStepId.EXCHANGE_MODES:
      return `Comment se passent vos échanges avec ${otherFirstName} ?`;
    case CheckinStepId.EXCHANGE_FREQUENCY:
      return `À quelle fréquence échangez-vous avec ${otherFirstName} ?`;
    case CheckinStepId.PERCEIVED_BENEFITS:
      return PERCEIVED_BENEFITS_TITLES[role];
    case CheckinStepId.PERCEIVED_SUPPORT:
      return PERCEIVED_SUPPORT_TITLES[role](otherFirstName);
    case CheckinStepId.RATING:
      return `Comment noteriez-vous votre relation avec ${otherFirstName} ?`;
    default:
      return '';
  }
};
