import { USER_ROLES } from 'src/constants/users';

export const authenticatedPermissions = [
  {
    paths: [
      '/backoffice/parametres',
      '/backoffice/profile/[userId]',
      '/backoffice/annuaire',
      '/backoffice/dashboard',
      '/backoffice/messaging',
    ],
    roles: '*',
  },
  {
    paths: [
      '/backoffice/candidat/[candidateId]',
      '/backoffice/candidat/[candidateId]/offres',
      '/backoffice/candidat/[candidateId]/suivi',
      '/backoffice/candidat/[candidateId]/cv',
      '/backoffice/admin/offres',
    ],
    roles: [USER_ROLES.CANDIDATE, USER_ROLES.COACH, USER_ROLES.REFERER],
  },
  {
    paths: ['/backoffice/candidat/list'],
    roles: [USER_ROLES.REFERER],
  },
  {
    paths: ['/backoffice/admin', '/backoffice/candidat/[candidateId]/offres'],
    roles: [USER_ROLES.ADMIN],
  },
];
