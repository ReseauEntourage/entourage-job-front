import { UserRoles } from 'src/constants/users';

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
      '/backoffice/candidat/[candidateId]/offres',
      '/backoffice/candidat/[candidateId]/suivi',
      '/backoffice/candidat/[candidateId]/cv',
      '/backoffice/admin/offres',
    ],
    roles: [UserRoles.CANDIDATE, UserRoles.COACH, UserRoles.REFERER],
  },
  {
    paths: [
      '/backoffice/candidat/list',
      '/backoffice/referer/orienter/[step]',
      '/backoffice/referer/orienter/confirmation',
    ],
    roles: [UserRoles.REFERER],
  },
  {
    paths: ['/backoffice/admin', '/backoffice/candidat/[candidateId]/offres'],
    roles: [UserRoles.ADMIN],
  },
];
