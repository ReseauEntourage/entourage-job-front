import { FilterConstant } from './utils';

export const USER_ROLES = {
  COACH: 'Coach',
  COACH_EXTERNAL: 'Coach externe',
  CANDIDATE: 'Candidat',
  CANDIDATE_EXTERNAL: 'Candidat externe',
  ADMIN: 'Admin',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export const USER_ROLES_FILTERS: FilterConstant<UserRole>[] = [
  { value: USER_ROLES.CANDIDATE, label: `${USER_ROLES.CANDIDATE} LKO` },
  {
    value: USER_ROLES.CANDIDATE_EXTERNAL,
    label: USER_ROLES.CANDIDATE_EXTERNAL,
  },
  { value: USER_ROLES.COACH, label: `${USER_ROLES.COACH} LKO` },
  { value: USER_ROLES.COACH_EXTERNAL, label: USER_ROLES.COACH_EXTERNAL },
  { value: USER_ROLES.ADMIN, label: USER_ROLES.ADMIN },
];

export const RELATED_ROLES = {
  [USER_ROLES.CANDIDATE]: USER_ROLES.COACH,
  [USER_ROLES.CANDIDATE_EXTERNAL]: USER_ROLES.COACH_EXTERNAL,
  [USER_ROLES.COACH]: USER_ROLES.CANDIDATE,
  [USER_ROLES.COACH_EXTERNAL]: USER_ROLES.CANDIDATE_EXTERNAL,
  [USER_ROLES.ADMIN]: USER_ROLES.ADMIN,
} as const;

export const ADMIN_ROLES = {
  CANDIDATES: 'Candidats',
  COMPANIES: 'Entreprises',
} as const;

export type AdminRole = (typeof ADMIN_ROLES)[keyof typeof ADMIN_ROLES];

export const NORMAL_USER_ROLES = [USER_ROLES.CANDIDATE, USER_ROLES.COACH];
export const EXTERNAL_USER_ROLES = [
  USER_ROLES.CANDIDATE_EXTERNAL,
  USER_ROLES.COACH_EXTERNAL,
];

export const CANDIDATE_USER_ROLES = [
  USER_ROLES.CANDIDATE,
  USER_ROLES.CANDIDATE_EXTERNAL,
];
export const COACH_USER_ROLES = [USER_ROLES.COACH, USER_ROLES.COACH_EXTERNAL];

export const ALL_USER_ROLES = [...CANDIDATE_USER_ROLES, ...COACH_USER_ROLES];

export const GENDERS = {
  MALE: 0,
  FEMALE: 1,
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
];
