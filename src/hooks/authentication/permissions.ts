import { UserRoles } from 'src/constants/users';

export const authenticatedPermissions = [
  {
    paths: [
      '/backoffice/parametres',
      '/backoffice/profile/[userId]',
      '/backoffice/annuaire',
      '/backoffice/messaging',
      '/backoffice/companies/parametres',
      '/backoffice/companies/[companyId]',
      '/backoffice/companies/[companyId]/collaborators',
    ],
    roles: '*',
  },
  {
    paths: [
      '/backoffice/dashboard',
      '/backoffice/candidat/[candidateId]',
      '/backoffice/candidat/[candidateId]/cv',
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
    paths: ['/backoffice/admin'],
    roles: [UserRoles.ADMIN],
  },
];
