import { USER_ROLES } from 'src/constants/users';

export const authenticatedPermissions = [
  {
    paths: [
      '/backoffice/parametres',
      '/backoffice/profile/[userId]',
      '/backoffice/annuaire',
      '/backoffice/messaging',
    ],
    roles: '*',
  },
  {
    paths: [
      '/backoffice/dashboard',
      '/backoffice/candidat/[candidateId]',
      '/backoffice/candidat/[candidateId]/suivi',
      '/backoffice/candidat/[candidateId]/cv',
    ],
    roles: [USER_ROLES.CANDIDATE, USER_ROLES.COACH, USER_ROLES.REFERER],
  },
  {
    paths: [
      '/backoffice/candidat/list',
      '/backoffice/referer/orienter/[step]',
      '/backoffice/referer/orienter/confirmation',
    ],
    roles: [USER_ROLES.REFERER],
  },
  {
    paths: ['/backoffice/admin'],
    roles: [USER_ROLES.ADMIN],
  },
];
