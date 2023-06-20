import { GA_TAGS } from 'src/constants/tags';
import { CANDIDATE_USER_ROLES, COACH_USER_ROLES } from 'src/constants/users';
import { getCandidateIdFromCoachOrCandidate } from 'src/utils/Finding';
import { AnyToFix } from "../../../../utils/Types";

const rolesToParams = (roles) => {
  return `${roles
    .map((role) => {
      return `role=${role}&`;
    })
    .join('')}`;
};

const candidateRolesParams = rolesToParams(CANDIDATE_USER_ROLES);
const coachRolesParams = rolesToParams(COACH_USER_ROLES);

export const renderLinks = (user, logout, candidateId): AnyToFix => {
  return {
    admin: [
      {
        href: '/backoffice/admin/membres',
        queryParams: `?${candidateRolesParams}${
          user?.zone ? `zone=${user?.zone}` : ''
        }`,
        name: 'Les membres',
        icon: 'users',
        badge: '',
        tag: GA_TAGS.BACKOFFICE_ADMIN_HEADER_MEMBERS_CLIC,
        subMenu: [
          {
            href: '/backoffice/admin/membres',
            queryParams: `?${candidateRolesParams}${
              user?.zone ? `zone=${user?.zone}` : ''
            }`,
            name: 'Les candidats',
            icon: 'users',
            badge: 'members',
            tag: GA_TAGS.BACKOFFICE_ADMIN_HEADER_CANDIDATS_CLIC,
          },
          {
            href: '/backoffice/admin/membres',
            queryParams: `?${coachRolesParams}${
              user?.zone ? `zone=${user?.zone}` : ''
            }`,
            name: 'Les coachs',
            icon: 'users',
            badge: '',
            tag: GA_TAGS.BACKOFFICE_ADMIN_HEADER_COACHS_CLIC,
          },
        ],
      },
      {
        href: '/backoffice/admin/structures',
        queryParams: `?${user?.zone ? `zone=${user?.zone}` : ''}`,
        name: 'Les structures partenaires',
        icon: 'home',
        badge: '',
        tag: GA_TAGS.BACKOFFICE_ADMIN_HEADER_ORGANIZATIONS_CLIC,
      },
      {
        href: '/backoffice/admin/offres',
        name: 'Les opportunités',
        icon: 'list',
        badge: 'offers',
      },
    ],
    dropdown: [
      {
        href: '/backoffice/parametres',
        icon: 'settings',
        name: 'Paramètres',
      },
      {
        onClick: logout,
        icon: 'sign-out',
        name: 'Se déconnecter',
      },
    ],
    candidat: [
      {
        href: `/backoffice/candidat/${candidateId}/offres/private`,
        name: 'Les offres',
        queryParams: `?status=-1`,
        icon: 'list',
        // badge: 'offers',
        tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_OFFRES_CLIC,
        subMenu: [
          {
            href: `/backoffice/candidat/${candidateId}/offres/private`,
            name: 'Mes offres',
            queryParams: `?status=-1`,
            // icon: 'list',
            badge: 'offers',
            tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_MES_OFFRES_CLIC,
          },
          {
            href: `/backoffice/candidat/${candidateId}/offres/public`,
            name: 'Toutes les offres',
            // icon: 'list',
            // badge: 'offers',
            tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_OFFRES_GENERALES_CLIC,
          },
        ],
      },
      {
        href: `/backoffice/candidat/${candidateId}/suivi`,
        name: 'Mon suivi',
        icon: 'file-text',
        badge: 'note',
        tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_SUIVI_CLIC,
      },
      {
        href: `/backoffice/candidat/${candidateId}/cv`,
        name: 'Mon CV',
        icon: 'user',
        badge: 'cv',
        tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_CV_CLIC,
      },
      {
        href: `${
          process.env.TOOLBOX_CANDIDATE_URL
        }?id=${getCandidateIdFromCoachOrCandidate(user)}`,
        name: 'Boîte à outils',
        icon: 'question',
        external: true,
        tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_BAO_CLIC,
      },
    ],
    candidat_externe: [
      {
        href: `/backoffice/candidat/${candidateId}/offres/private`,
        name: 'Les offres',
        queryParams: `?status=-1`,
        icon: 'list',
        // badge: 'offers',
        tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_OFFRES_CLIC,
        subMenu: [
          {
            href: `/backoffice/candidat/${candidateId}/offres/private`,
            name: 'Mes offres',
            queryParams: `?status=-1`,
            // icon: 'list',
            badge: 'offers',
            tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_MES_OFFRES_CLIC,
          },
          {
            href: `/backoffice/candidat/${candidateId}/offres/public`,
            name: 'Toutes les offres',
            // icon: 'list',
            // badge: 'offers',
            tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_OFFRES_GENERALES_CLIC,
          },
        ],
      },
      {
        href: `/backoffice/candidat/${candidateId}/suivi`,
        name: 'Mon suivi',
        icon: 'file-text',
        badge: 'note',
        tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_SUIVI_CLIC,
      },
      {
        href: `/backoffice/candidat/${candidateId}/cv`,
        name: 'Mon CV',
        icon: 'user',
        badge: 'cv',
        tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_CV_CLIC,
      },
      {
        href: `${
          process.env.TOOLBOX_CANDIDATE_URL
        }?id=${getCandidateIdFromCoachOrCandidate(user)}`,
        name: 'Boîte à outils',
        icon: 'question',
        external: true,
        tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_BAO_CLIC,
      },
    ],
    coach: [
      {
        href: `/backoffice/candidat/${candidateId}/offres/private`,
        name: 'Les offres',
        queryParams: `?status=-1`,
        icon: 'list',
        // badge: 'offers',
        tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_OFFRES_CLIC,
        subMenu: [
          {
            href: `/backoffice/candidat/${candidateId}/offres/private`,
            name: 'Offres du candidat',
            queryParams: `?status=-1`,
            // icon: 'list',
            badge: 'offers',
            tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_MES_OFFRES_CLIC,
          },
          {
            href: `/backoffice/candidat/${candidateId}/offres/public`,
            name: 'Toutes les offres',
            // icon: 'list',
            // badge: 'offers',
            tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_OFFRES_GENERALES_CLIC,
          },
        ],
      },
      {
        href: `/backoffice/candidat/${candidateId}/suivi`,
        name: 'Suivi',
        icon: 'file-text',
        badge: 'note',
        tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_SUIVI_CLIC,
      },
      {
        href: `/backoffice/candidat/${candidateId}/cv`,
        name: 'CV',
        icon: 'user',
        badge: 'cv',
        tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_CV_CLIC,
      },
      {
        href: `${
          process.env.TOOLBOX_COACH_URL
        }?id=${getCandidateIdFromCoachOrCandidate(user)}`,
        name: 'Boîte à outils',
        icon: 'question',
        external: true,
        tag: GA_TAGS.BACKOFFICE_COACH_HEADER_BAO_CLIC,
      },
    ],
    coach_externe: [
      {
        href: `/backoffice/candidat/list`,
        name: 'Retour à la liste des candidats',
        icon: 'chevron-left',
      },
      {
        href: `/backoffice/candidat/${candidateId}/offres/private`,
        name: 'Les offres',
        queryParams: `?status=-1`,
        icon: 'list',
        disabled: !candidateId,
        // badge: 'offers',
        tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_OFFRES_CLIC,
        subMenu: [
          {
            href: `/backoffice/candidat/${candidateId}/offres/private`,
            name: 'Offres du candidat',
            queryParams: `?status=-1`,
            // icon: 'list',
            badge: 'offers',
            tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_MES_OFFRES_CLIC,
          },
          {
            href: `/backoffice/candidat/${candidateId}/offres/public`,
            name: 'Toutes les offres',
            // icon: 'list',
            // badge: 'offers',
            tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_OFFRES_GENERALES_CLIC,
          },
        ],
      },
      {
        href: `/backoffice/candidat/${candidateId}/suivi`,
        name: 'Suivi',
        icon: 'file-text',
        badge: 'note',
        disabled: !candidateId,
        tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_SUIVI_CLIC,
      },
      {
        href: `/backoffice/candidat/${candidateId}/cv`,
        name: 'CV',
        icon: 'user',
        badge: 'cv',
        disabled: !candidateId,
        tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_CV_CLIC,
      },
      {
        href: `${
          process.env.TOOLBOX_COACH_URL
        }?id=${getCandidateIdFromCoachOrCandidate(user)}`,
        name: 'Boîte à outils',
        icon: 'question',
        external: true,
        tag: GA_TAGS.BACKOFFICE_COACH_HEADER_BAO_CLIC,
      },
    ],
  };
};
