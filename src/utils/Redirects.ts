const defaultPages = {
  admin: '/backoffice/admin/offres',
  candidat: '/backoffice/candidat/cv',
  candidat_externe: '/backoffice/candidat/cv',
  coach: '/backoffice/candidat/cv',
  coach_externe: '/backoffice/candidat/list',
};

// export const redirectBackOfficeToDefault: (
//   currentRole: string,
//   exceptions: string[]
// ) => void = (currentRole, exceptions) => {
//   if (exceptions.includes(currentRole)) return;
//   return defaultPages[currentRole];
// };

export const getDefaultUrl = (currentRole: string): string => {
  return defaultPages[currentRole];
};
