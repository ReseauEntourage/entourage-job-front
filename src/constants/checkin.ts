import { IconName } from '@/src/components/ui/Icons/LucidIcon';
import { UserRoles } from './users';

export enum CheckinStillInTouch {
  YES = 'YES',
  NO_MADE_ROUND = 'NO_MADE_ROUND',
  NO_TOO_BAD = 'NO_TOO_BAD',
}

export const CHECKIN_STILL_IN_TOUCH_LABELS: Record<
  CheckinStillInTouch,
  string
> = {
  [CheckinStillInTouch.YES]: 'Oui',
  [CheckinStillInTouch.NO_MADE_ROUND]: 'Non, nous avons fait le tour',
  [CheckinStillInTouch.NO_TOO_BAD]: 'Non, et c’est dommage',
};

export enum CheckinExchangeMode {
  ENTOURAGE_PRO_MESSAGES = 'ENTOURAGE_PRO_MESSAGES',
  OUTSIDE_MESSAGES = 'OUTSIDE_MESSAGES',
  PHONE = 'PHONE',
  VIDEO = 'VIDEO',
  IN_PERSON = 'IN_PERSON',
  OTHER = 'OTHER',
}

export const CHECKIN_EXCHANGE_MODE_LABELS: Record<CheckinExchangeMode, string> =
  {
    [CheckinExchangeMode.ENTOURAGE_PRO_MESSAGES]:
      'Par messages sur Entourage Pro',
    [CheckinExchangeMode.OUTSIDE_MESSAGES]:
      'Par messages en dehors d’Entourage',
    [CheckinExchangeMode.PHONE]: 'Par téléphone',
    [CheckinExchangeMode.VIDEO]: 'En visio',
    [CheckinExchangeMode.IN_PERSON]: 'En présentiel',
    [CheckinExchangeMode.OTHER]: 'Autre',
  };

export enum CheckinExchangeFrequency {
  MORE_THAN_WEEKLY = 'MORE_THAN_WEEKLY',
  WEEKLY = 'WEEKLY',
  TWICE_A_MONTH = 'TWICE_A_MONTH',
  MONTHLY = 'MONTHLY',
  ONE_OFF = 'ONE_OFF',
}

export const CHECKIN_EXCHANGE_FREQUENCY_LABELS: Record<
  CheckinExchangeFrequency,
  string
> = {
  [CheckinExchangeFrequency.MORE_THAN_WEEKLY]: 'Plus d’une fois par semaine',
  [CheckinExchangeFrequency.WEEKLY]: 'Environ une fois par semaine',
  [CheckinExchangeFrequency.TWICE_A_MONTH]: 'Deux fois par mois',
  [CheckinExchangeFrequency.MONTHLY]: 'Une fois par mois',
  [CheckinExchangeFrequency.ONE_OFF]: 'Un échange ponctuel, une seule fois',
};

// Candidate-only options, in addition to the shared NOTHING_YET / OTHER below.
export enum CheckinPerceivedBenefitCandidate {
  DYNAMIZE_NETWORK = 'DYNAMIZE_NETWORK',
  IDENTIFY_OPPORTUNITIES = 'IDENTIFY_OPPORTUNITIES',
  CONCRETE_ADVICE = 'CONCRETE_ADVICE',
  WORK_ON_POSTURE = 'WORK_ON_POSTURE',
  METHODOLOGICAL_SUPPORT = 'METHODOLOGICAL_SUPPORT',
  MORAL_SUPPORT = 'MORAL_SUPPORT',
  MEANINGFUL_HUMAN_ENCOUNTER = 'MEANINGFUL_HUMAN_ENCOUNTER',
  BUILD_PROFESSIONAL_PROJECT = 'BUILD_PROFESSIONAL_PROJECT',
  FIND_JOB_INTERNSHIP_OR_APPRENTICESHIP = 'FIND_JOB_INTERNSHIP_OR_APPRENTICESHIP',
  FIND_TRAINING = 'FIND_TRAINING',
}

// Coach-only options, in addition to the shared NOTHING_YET / OTHER below.
export enum CheckinPerceivedBenefitCoach {
  FEELING_USEFUL = 'FEELING_USEFUL',
  MEANINGFUL_HUMAN_ENCOUNTER = 'MEANINGFUL_HUMAN_ENCOUNTER',
  NEW_PERSPECTIVE_ON_OBSTACLES = 'NEW_PERSPECTIVE_ON_OBSTACLES',
  LISTENING_AND_POSTURE_SKILLS = 'LISTENING_AND_POSTURE_SKILLS',
  MEANING_IN_PROFESSIONAL_LIFE = 'MEANING_IN_PROFESSIONAL_LIFE',
  WISH_TO_GET_MORE_INVOLVED = 'WISH_TO_GET_MORE_INVOLVED',
}

// Shared across roles — NOTHING_YET is the mutually-exclusive option.
export enum CheckinPerceivedBenefitShared {
  NOTHING_YET = 'NOTHING_YET',
  OTHER = 'OTHER',
}

export type CheckinPerceivedBenefit =
  | CheckinPerceivedBenefitCandidate
  | CheckinPerceivedBenefitCoach
  | CheckinPerceivedBenefitShared;

export type PerceivedBenefitOption = {
  value: CheckinPerceivedBenefit;
  label: string;
  icon: IconName;
  // Empty when the option is self-explanatory and needs no further detail.
  description: string;
};

const CANDIDATE_PERCEIVED_BENEFIT_OPTIONS: PerceivedBenefitOption[] = [
  {
    value: CheckinPerceivedBenefitCandidate.DYNAMIZE_NETWORK,
    label: 'Dynamiser votre réseau pro',
    icon: 'Users',
    description: 'Nouveaux contacts, LinkedIn...',
  },
  {
    value: CheckinPerceivedBenefitCandidate.IDENTIFY_OPPORTUNITIES,
    label: 'Identifier des opportunités',
    icon: 'Search',
    description: 'Métiers, offres, salons, structures...',
  },
  {
    value: CheckinPerceivedBenefitCandidate.CONCRETE_ADVICE,
    label: 'Avoir des conseils concrets',
    icon: 'FileText',
    description: 'CV, rédaction de mails, outils...',
  },
  {
    value: CheckinPerceivedBenefitCandidate.WORK_ON_POSTURE,
    label: 'Travailler votre posture',
    icon: 'UserCheck',
    description: 'Vous présenter, valoriser votre parcours...',
  },
  {
    value: CheckinPerceivedBenefitCandidate.METHODOLOGICAL_SUPPORT,
    label: 'Avoir un soutien méthodologique',
    icon: 'ListChecks',
    description: 'Prochaines étapes, organisation...',
  },
  {
    value: CheckinPerceivedBenefitCandidate.MORAL_SUPPORT,
    label: 'Avoir un soutien moral',
    icon: 'Heart',
    description: 'Prendre de vos nouvelles, vous remotiver...',
  },
  {
    value: CheckinPerceivedBenefitCandidate.MEANINGFUL_HUMAN_ENCOUNTER,
    label: 'Une rencontre humaine qui compte',
    icon: 'Users',
    description: 'Un lien sincère, au-delà de l’accompagnement',
  },
  {
    value: CheckinPerceivedBenefitCandidate.BUILD_PROFESSIONAL_PROJECT,
    label: 'Construire ou préciser votre projet professionnel',
    icon: 'Compass',
    description: 'Clarifier vos objectifs, explorer des pistes...',
  },
  {
    value:
      CheckinPerceivedBenefitCandidate.FIND_JOB_INTERNSHIP_OR_APPRENTICESHIP,
    label: 'Trouver un emploi, un stage ou une alternance',
    icon: 'Briefcase',
    description: 'Candidatures, mise en relation...',
  },
  {
    value: CheckinPerceivedBenefitCandidate.FIND_TRAINING,
    label: 'Trouver une formation',
    icon: 'GraduationCap',
    description: '',
  },
];

const COACH_PERCEIVED_BENEFIT_OPTIONS: PerceivedBenefitOption[] = [
  {
    value: CheckinPerceivedBenefitCoach.FEELING_USEFUL,
    label: "Le sentiment d'être utile",
    icon: 'Smile',
    description: 'Sentir que votre accompagnement compte vraiment',
  },
  {
    value: CheckinPerceivedBenefitCoach.MEANINGFUL_HUMAN_ENCOUNTER,
    label: 'Une rencontre humaine qui compte',
    icon: 'Users',
    description: 'Un lien sincère, au-delà de l’accompagnement',
  },
  {
    value: CheckinPerceivedBenefitCoach.NEW_PERSPECTIVE_ON_OBSTACLES,
    label: 'Un autre regard sur les obstacles à l’emploi',
    icon: 'Eye',
    description: 'Comprendre des réalités différentes des vôtres',
  },
  {
    value: CheckinPerceivedBenefitCoach.LISTENING_AND_POSTURE_SKILLS,
    label: 'Des compétences d’écoute et de posture',
    icon: 'Ear',
    description: 'Progresser dans votre posture de coach',
  },
  {
    value: CheckinPerceivedBenefitCoach.MEANING_IN_PROFESSIONAL_LIFE,
    label: 'Du sens dans mon quotidien professionnel',
    icon: 'Sparkles',
    description: 'Donner du sens à votre engagement',
  },
  {
    value: CheckinPerceivedBenefitCoach.WISH_TO_GET_MORE_INVOLVED,
    label: 'L’envie de m’engager davantage',
    icon: 'Rocket',
    description: 'Continuer ou élargir votre engagement solidaire',
  },
];

const NOTHING_YET_OPTION = (role: UserRoles): PerceivedBenefitOption => ({
  value: CheckinPerceivedBenefitShared.NOTHING_YET,
  label:
    role === UserRoles.COACH
      ? 'Rien de particulier pour l’instant'
      : 'Rien de concret pour l’instant',
  icon: 'CircleX',
  description: '',
});

const OTHER_OPTION: PerceivedBenefitOption = {
  value: CheckinPerceivedBenefitShared.OTHER,
  label: 'Autre',
  icon: 'Ellipsis',
  description: '',
};

export const getPerceivedBenefitOptions = (
  role: UserRoles
): PerceivedBenefitOption[] => {
  const roleOptions =
    role === UserRoles.COACH
      ? COACH_PERCEIVED_BENEFIT_OPTIONS
      : CANDIDATE_PERCEIVED_BENEFIT_OPTIONS;
  return [...roleOptions, NOTHING_YET_OPTION(role), OTHER_OPTION];
};

export enum CheckinEmploymentType {
  JOB = 'JOB',
  INTERNSHIP = 'INTERNSHIP',
  APPRENTICESHIP = 'APPRENTICESHIP',
  CIVIC_SERVICE = 'CIVIC_SERVICE',
}

export const CHECKIN_EMPLOYMENT_TYPE_LABELS: Record<
  CheckinEmploymentType,
  string
> = {
  [CheckinEmploymentType.JOB]: 'Un emploi',
  [CheckinEmploymentType.INTERNSHIP]: 'Un stage',
  [CheckinEmploymentType.APPRENTICESHIP]: 'Une alternance',
  [CheckinEmploymentType.CIVIC_SERVICE]: 'Un service civique',
};

export enum CheckinPerceivedSupport {
  YES_A_LOT = 'YES_A_LOT',
  YES_A_BIT = 'YES_A_BIT',
  NOT_AT_ALL = 'NOT_AT_ALL',
  DONT_KNOW = 'DONT_KNOW',
}

export const CHECKIN_PERCEIVED_SUPPORT_LABELS: Record<
  CheckinPerceivedSupport,
  string
> = {
  [CheckinPerceivedSupport.YES_A_LOT]: 'Oui, beaucoup',
  [CheckinPerceivedSupport.YES_A_BIT]: 'Oui, un peu',
  [CheckinPerceivedSupport.NOT_AT_ALL]: 'Non, pas du tout',
  [CheckinPerceivedSupport.DONT_KNOW]: 'Je ne sais pas',
};

export const CHECKIN_ELIGIBILITY_THRESHOLD_DAYS = 30;
