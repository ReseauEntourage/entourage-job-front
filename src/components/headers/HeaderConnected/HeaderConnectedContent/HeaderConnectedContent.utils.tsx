import React from 'react';
import ChevronLeftIcon from 'assets/icons/chevron-left.svg';
import DocumentIcon from 'assets/icons/document.svg';
import HomeIcon from 'assets/icons/home.svg';
import ListIcon from 'assets/icons/list.svg';
import LogOutIcon from 'assets/icons/log-out.svg';
import QuestionIcon from 'assets/icons/question.svg';
import SettingsIcon from 'assets/icons/settings.svg';
import UserIcon from 'assets/icons/user.svg';
import { HeaderConnectedMainItem } from '../HeaderConnected.types';
import { UserWithUserCandidate } from 'src/api/types';
import { GA_TAGS } from 'src/constants/tags';
import {
  CANDIDATE_USER_ROLES,
  COACH_USER_ROLES,
  USER_ROLES,
  UserRole,
} from 'src/constants/users';
import { getCandidateIdFromCoachOrCandidate } from 'src/utils/Finding';

const rolesToParams = (roles) => {
  return `${roles
    .map((role) => {
      return `role=${role}&`;
    })
    .join('')}`;
};

const candidateRolesParams = rolesToParams(CANDIDATE_USER_ROLES);
const coachRolesParams = rolesToParams(COACH_USER_ROLES);

export const renderLinks = (
  user: UserWithUserCandidate,
  logout: () => void,
  candidateId: string
): {
  links: { [K in UserRole]: HeaderConnectedMainItem[] };
  dropdown: HeaderConnectedMainItem[];
} => {
  return {
    links: {
      [USER_ROLES.ADMIN]: [
        {
          href: '/backoffice/admin/membres',
          queryParams: `?${candidateRolesParams}${
            user?.zone ? `zone=${user?.zone}` : ''
          }`,
          name: 'Les membres',
          icon: <UserIcon />,
          tag: GA_TAGS.BACKOFFICE_ADMIN_HEADER_MEMBERS_CLIC,
          subMenu: [
            {
              href: '/backoffice/admin/membres',
              queryParams: `?${candidateRolesParams}${
                user?.zone ? `zone=${user?.zone}` : ''
              }`,
              name: 'Les candidats',
              // icon: <UserEmptyIcon />,
              badge: 'members',
              tag: GA_TAGS.BACKOFFICE_ADMIN_HEADER_CANDIDATS_CLIC,
            },
            {
              href: '/backoffice/admin/membres',
              queryParams: `?${coachRolesParams}${
                user?.zone ? `zone=${user?.zone}` : ''
              }`,
              name: 'Les coachs',
              // icon: <UserEmptyIcon />,
              tag: GA_TAGS.BACKOFFICE_ADMIN_HEADER_COACHS_CLIC,
            },
          ],
        },
        {
          href: '/backoffice/admin/structures',
          queryParams: `?${user?.zone ? `zone=${user?.zone}` : ''}`,
          name: 'Les structures partenaires',
          icon: <HomeIcon />,
          tag: GA_TAGS.BACKOFFICE_ADMIN_HEADER_ORGANIZATIONS_CLIC,
        },
        {
          href: '/backoffice/admin/offres',
          name: 'Les opportunités',
          icon: <ListIcon />,
          badge: 'offers',
        },
      ],
      [USER_ROLES.CANDIDATE]: [
        {
          href: `/backoffice/candidat/${candidateId}/offres/private`,
          name: 'Les offres',
          queryParams: `?status=-1`,
          icon: <ListIcon />,
          tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_OFFRES_CLIC,
          subMenu: [
            {
              href: `/backoffice/candidat/${candidateId}/offres/private`,
              name: 'Mes offres',
              queryParams: `?status=-1`,
              badge: 'offers',
              tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_MES_OFFRES_CLIC,
            },
            {
              href: `/backoffice/candidat/${candidateId}/offres/public`,
              name: 'Toutes les offres',
              tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_OFFRES_GENERALES_CLIC,
            },
          ],
        },
        {
          href: `/backoffice/candidat/${candidateId}/suivi`,
          name: 'Mon suivi',
          icon: <DocumentIcon />,
          badge: 'note',
          tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_SUIVI_CLIC,
        },
        {
          href: `/backoffice/candidat/${candidateId}/cv`,
          name: 'Mon CV',
          icon: <UserIcon />,
          badge: 'cv',
          tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_CV_CLIC,
        },
        {
          href: `${
            process.env.TOOLBOX_CANDIDATE_URL
          }?id=${getCandidateIdFromCoachOrCandidate(user)}`,
          name: 'Boîte à outils',
          icon: <QuestionIcon />,
          external: true,
          tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_BAO_CLIC,
        },
      ],
      [USER_ROLES.CANDIDATE_EXTERNAL]: [
        {
          href: `/backoffice/candidat/${candidateId}/offres/private`,
          name: 'Les offres',
          queryParams: `?status=-1`,
          icon: <ListIcon />,
          tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_OFFRES_CLIC,
          subMenu: [
            {
              href: `/backoffice/candidat/${candidateId}/offres/private`,
              name: 'Mes offres',
              queryParams: `?status=-1`,
              badge: 'offers',
              tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_MES_OFFRES_CLIC,
            },
            {
              href: `/backoffice/candidat/${candidateId}/offres/public`,
              name: 'Toutes les offres',
              tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_OFFRES_GENERALES_CLIC,
            },
          ],
        },
        {
          href: `/backoffice/candidat/${candidateId}/suivi`,
          name: 'Mon suivi',
          icon: <DocumentIcon />,
          badge: 'note',
          tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_SUIVI_CLIC,
        },
        {
          href: `/backoffice/candidat/${candidateId}/cv`,
          name: 'Mon CV',
          icon: <UserIcon />,
          badge: 'cv',
          tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_CV_CLIC,
        },
        {
          href: `${
            process.env.TOOLBOX_CANDIDATE_URL
          }?id=${getCandidateIdFromCoachOrCandidate(user)}`,
          name: 'Boîte à outils',
          icon: <QuestionIcon />,
          external: true,
          tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_BAO_CLIC,
        },
      ],
      [USER_ROLES.COACH]: [
        {
          href: `/backoffice/candidat/${candidateId}/offres/private`,
          name: 'Les offres',
          queryParams: `?status=-1`,
          icon: <ListIcon />,
          tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_OFFRES_CLIC,
          subMenu: [
            {
              href: `/backoffice/candidat/${candidateId}/offres/private`,
              name: 'Offres du candidat',
              queryParams: `?status=-1`,
              badge: 'offers',
              tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_MES_OFFRES_CLIC,
            },
            {
              href: `/backoffice/candidat/${candidateId}/offres/public`,
              name: 'Toutes les offres',
              tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_OFFRES_GENERALES_CLIC,
            },
          ],
        },
        {
          href: `/backoffice/candidat/${candidateId}/suivi`,
          name: 'Suivi',
          icon: <DocumentIcon />,
          badge: 'note',
          tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_SUIVI_CLIC,
        },
        {
          href: `/backoffice/candidat/${candidateId}/cv`,
          name: 'CV',
          icon: <UserIcon />,
          badge: 'cv',
          tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_CV_CLIC,
        },
        {
          href: `${
            process.env.TOOLBOX_COACH_URL
          }?id=${getCandidateIdFromCoachOrCandidate(user)}`,
          name: 'Boîte à outils',
          icon: <QuestionIcon />,
          external: true,
          tag: GA_TAGS.BACKOFFICE_COACH_HEADER_BAO_CLIC,
        },
      ],
      [USER_ROLES.COACH_EXTERNAL]: [
        {
          href: `/backoffice/candidat/list`,
          name: 'Retour à la liste des candidats',
          icon: <ChevronLeftIcon />,
        },
        {
          href: `/backoffice/candidat/${candidateId}/offres/private`,
          name: 'Les offres',
          queryParams: `?status=-1`,
          icon: <ListIcon />,
          disabled: !candidateId,
          tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_OFFRES_CLIC,
          subMenu: [
            {
              href: `/backoffice/candidat/${candidateId}/offres/private`,
              name: 'Offres du candidat',
              queryParams: `?status=-1`,
              badge: 'offers',
              tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_MES_OFFRES_CLIC,
            },
            {
              href: `/backoffice/candidat/${candidateId}/offres/public`,
              name: 'Toutes les offres',
              tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_OFFRES_GENERALES_CLIC,
            },
          ],
        },
        {
          href: `/backoffice/candidat/${candidateId}/suivi`,
          name: 'Suivi',
          icon: <DocumentIcon />,
          badge: 'note',
          disabled: !candidateId,
          tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_SUIVI_CLIC,
        },
        {
          href: `/backoffice/candidat/${candidateId}/cv`,
          name: 'CV',
          icon: <UserIcon />,
          badge: 'cv',
          disabled: !candidateId,
          tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_CV_CLIC,
        },
        {
          href: `${
            process.env.TOOLBOX_COACH_URL
          }?id=${getCandidateIdFromCoachOrCandidate(user)}`,
          name: 'Boîte à outils',
          icon: <QuestionIcon />,
          external: true,
          tag: GA_TAGS.BACKOFFICE_COACH_HEADER_BAO_CLIC,
        },
      ],
    },
    dropdown: [
      {
        href: '/backoffice/parametres',
        icon: <SettingsIcon />,
        name: 'Paramètres',
      },
      {
        href: '',
        onClick: logout,
        icon: <LogOutIcon />,
        name: 'Se déconnecter',
      },
    ],
  };
};
