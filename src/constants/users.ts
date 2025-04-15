import { FilterConstant } from './utils';

// USER ROLES ENUM
// eslint-disable-next-line no-shadow
export enum UserRoles {
  COACH = 'Coach',
  CANDIDATE = 'Candidat',
  ADMIN = 'Admin',
  REFERER = 'Prescripteur',
}

// User groupements
export type NormalUserRoles = UserRoles.CANDIDATE | UserRoles.COACH;
export type RegistrableUserRoles =
  | UserRoles.CANDIDATE
  | UserRoles.COACH
  | UserRoles.REFERER;
export type RolesWithOrganization = UserRoles.REFERER;

// Helpers
export const getNormalUserRoles = (): UserRoles[] => {
  return Object.values(UserRoles).filter(
    (role): role is NormalUserRoles =>
      role === UserRoles.CANDIDATE || role === UserRoles.COACH
  );
};

export const getRegistrableUserRoles = (): UserRoles[] => {
  return Object.values(UserRoles).filter(
    (role): role is RegistrableUserRoles =>
      role === UserRoles.CANDIDATE ||
      role === UserRoles.COACH ||
      role === UserRoles.REFERER
  );
};

export const getRolesWithOrganization = (): UserRoles[] => {
  return Object.values(UserRoles).filter(
    (role): role is RolesWithOrganization => role === UserRoles.REFERER
  );
};

export const USER_ROLES_FILTERS: FilterConstant<UserRoles>[] = [
  { value: UserRoles.CANDIDATE, label: UserRoles.CANDIDATE },
  { value: UserRoles.COACH, label: UserRoles.COACH },
  { value: UserRoles.REFERER, label: UserRoles.REFERER },
  { value: UserRoles.ADMIN, label: UserRoles.ADMIN },
];

export const RELATED_ROLES = {
  [UserRoles.CANDIDATE]: UserRoles.COACH,
  [UserRoles.COACH]: UserRoles.CANDIDATE,
  [UserRoles.ADMIN]: UserRoles.ADMIN,
  [UserRoles.REFERER]: UserRoles.CANDIDATE,
} as const;

// export const ADMIN_ROLES = {
//   CANDIDATES: 'Candidats',
//   COMPANIES: 'Entreprises',
// } as const;
// type AdminRole = (typeof ADMIN_ROLES)[keyof typeof ADMIN_ROLES];

// What to do with that ?
// eslint-disable-next-line no-shadow
export enum AdminRoles {
  CANDIDATES = 'Candidats',
  COMPANIES = 'Entreprises',
}
