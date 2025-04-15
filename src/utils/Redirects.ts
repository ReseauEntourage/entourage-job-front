import { UserRoles } from 'src/constants/users';

const defaultPages = {
  [UserRoles.ADMIN]: '/backoffice/admin/offres',
  [UserRoles.CANDIDATE]: '/backoffice/dashboard',
  [UserRoles.COACH]: '/backoffice/dashboard',
  [UserRoles.REFERER]: '/backoffice/dashboard',
} as const;

// export const redirectBackOfficeToDefault: (
//   currentRole: string,
//   exceptions: string[]
// ) => void = (currentRole, exceptions) => {
//   if (exceptions.includes(currentRole)) return;
//   return defaultPages[currentRole];
// };

export const getDefaultUrl = (currentRole: UserRoles): string => {
  return defaultPages[currentRole];
};
