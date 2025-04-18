import { USER_ROLES, UserRole } from 'src/constants/users';

const defaultPages = {
  [USER_ROLES.ADMIN]: '/backoffice/admin/membres',
  [USER_ROLES.CANDIDATE]: '/backoffice/dashboard',
  [USER_ROLES.COACH]: '/backoffice/dashboard',
  [USER_ROLES.REFERER]: '/backoffice/dashboard',
} as const;

// export const redirectBackOfficeToDefault: (
//   currentRole: string,
//   exceptions: string[]
// ) => void = (currentRole, exceptions) => {
//   if (exceptions.includes(currentRole)) return;
//   return defaultPages[currentRole];
// };

export const getDefaultUrl = (currentRole: UserRole): string => {
  return defaultPages[currentRole];
};
