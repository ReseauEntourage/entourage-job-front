import { FilterConstant } from './utils';

export const USER_ROLES = {
  COACH: 'Coach',
  CANDIDATE: 'Candidat',
  ADMIN: 'Admin',
  REFERRER: 'Orienteur',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export const USER_ROLES_FILTERS: FilterConstant<UserRole>[] = [
  { value: USER_ROLES.CANDIDATE, label: `${USER_ROLES.CANDIDATE} LKO` },
  { value: USER_ROLES.COACH, label: `${USER_ROLES.COACH} LKO` },
  { value: USER_ROLES.REFERRER, label: USER_ROLES.REFERRER },
  { value: USER_ROLES.ADMIN, label: USER_ROLES.ADMIN },
];

export const RELATED_ROLES = {
  [USER_ROLES.CANDIDATE]: USER_ROLES.COACH,
  [USER_ROLES.COACH]: USER_ROLES.CANDIDATE,
  [USER_ROLES.ADMIN]: USER_ROLES.ADMIN,
  [USER_ROLES.REFERRER]: USER_ROLES.REFERRER,
} as const;

export const ADMIN_ROLES = {
  CANDIDATES: 'Candidats',
  COMPANIES: 'Entreprises',
} as const;

export const ROLES_WITH_ORGANIZATION = [USER_ROLES.REFERRER];

export type AdminRole = (typeof ADMIN_ROLES)[keyof typeof ADMIN_ROLES];

export type NormalUserRole =
  | typeof USER_ROLES.CANDIDATE
  | typeof USER_ROLES.COACH;

export type RegistrableUserRole =
  | typeof USER_ROLES.CANDIDATE
  | typeof USER_ROLES.COACH
  | typeof USER_ROLES.REFERRER;

export const NORMAL_USER_ROLES: NormalUserRole[] = [
  USER_ROLES.CANDIDATE,
  USER_ROLES.COACH,
];

export const ALL_USER_ROLES = [USER_ROLES.CANDIDATE, USER_ROLES.COACH];

export const GENDERS = {
  MALE: 0,
  FEMALE: 1,
  OTHER: 2,
} as const;

export type Gender = (typeof GENDERS)[keyof typeof GENDERS];

export const GENDERS_FILTERS = [
  {
    label: 'Homme',
    value: GENDERS.MALE,
  },
  {
    label: 'Femme',
    value: GENDERS.FEMALE,
  },
  /*  {
     label: 'Autre',
     value: GENDERS.OTHER,
   }, */
];

export const USER_REPORT_REASONS = [
  { value: 'SPAM', label: 'Spam' },
  { value: 'FRAUD', label: 'Arnaque' },
  { value: 'INSULTS', label: 'Propos déplacés' },
  { value: 'IN_DANGER', label: 'Mise en danger' },
  { value: 'OTHER', label: 'Autre' },
];
