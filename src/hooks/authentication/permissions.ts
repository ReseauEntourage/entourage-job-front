import { USER_ROLES } from 'src/constants/users';

export const authenticatedPermissions = [
  {
    paths: ['/backoffice/parametres', '/backoffice/profile/[userId]'],
    roles: '*',
  },
  {
    paths: [
      '/backoffice/candidat/cv',
      '/backoffice/candidat/offres',
      '/backoffice/candidat/suivi',
      '/backoffice/candidat/[candidateId]',
      '/backoffice/candidat/[candidateId]/offres',
      '/backoffice/candidat/[candidateId]/suivi',
      '/backoffice/candidat/[candidateId]/cv',
      '/backoffice/admin/offres',
      '/backoffice/annuaire',
    ],
    roles: [
      USER_ROLES.CANDIDATE,
      USER_ROLES.CANDIDATE_EXTERNAL,
      USER_ROLES.COACH,
      USER_ROLES.COACH_EXTERNAL,
    ],
  },
  {
    paths: ['/backoffice/candidat/list'],
    roles: [USER_ROLES.COACH_EXTERNAL],
  },
  {
    paths: [
      '/backoffice/admin',
      '/backoffice/candidat/offres',
      '/backoffice/candidat/[candidateId]/offres',
    ],
    roles: [USER_ROLES.ADMIN],
  },
];
