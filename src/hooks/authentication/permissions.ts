import { USER_ROLES } from 'src/constants/users';

export const authenticatedPermissions = [
  {
    paths: ['/backoffice/parametres'],
    roles: '*',
  },
  {
    paths: [
      '/backoffice/candidat/cv',
      '/backoffice/candidat/[candidateId]/offres',
      '/backoffice/candidat/[candidateId]/suivi',
      '/backoffice/candidat/[candidateId]/cv',
    ],
    roles: [
      USER_ROLES.CANDIDATE,
      USER_ROLES.CANDIDATE_EXTERNAL,
      USER_ROLES.COACH,
    ],
  },
  {
    paths: ['/backoffice/candidat/list'],
    roles: [USER_ROLES.COACH_EXTERNAL],
  },
  {
    paths: ['/backoffice/admin', '/backoffice/candidat/offres'],
    roles: [USER_ROLES.ADMIN],
  },
];
