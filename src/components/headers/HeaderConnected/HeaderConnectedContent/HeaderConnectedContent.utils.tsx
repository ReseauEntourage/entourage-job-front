import React from 'react';
import { HeaderConnectedMainItem } from '../HeaderConnected.types';
import { UserWithUserCandidate } from 'src/api/types';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { GA_TAGS } from 'src/constants/tags';
import { UserRoles } from 'src/constants/users';
import { getCandidateIdFromCoachOrCandidate } from 'src/utils/Finding';

const rolesToParams = (roles) => {
  return `${roles
    .map((role) => {
      return `role=${role}&`;
    })
    .join('')}`;
};

const candidateRolesParams = rolesToParams([UserRoles.CANDIDATE]);
const coachRolesParams = rolesToParams([UserRoles.COACH]);
const refererRolesParams = rolesToParams([UserRoles.REFERER]);

export const renderLinks = (
  user: UserWithUserCandidate,
  logout: () => void,
  candidateId: string
): {
  links: { [K in UserRoles]: HeaderConnectedMainItem[] };
  messaging: HeaderConnectedMainItem;
  dropdown: HeaderConnectedMainItem[];
} => {
  const candidateHeaderItems: HeaderConnectedMainItem[] = [
    {
      href: '/backoffice/dashboard',
      name: 'Mon espace',
      tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_DASHBOARD_CLIC,
    },
    {
      href: `/backoffice/candidat/${candidateId}/cv`,
      name: 'Mon CV',
      badge: 'cv',
      tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_CV_CLIC,
    },
    {
      href: '/backoffice/annuaire',
      name: "Réseau d'entraide",
    },
    {
      href: `/backoffice/candidat/${candidateId}/offres/private`,
      name: 'Les offres',
      queryParams: `?status=-1`,
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
      badge: 'note',
      tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_SUIVI_CLIC,
    },
    {
      href: `${
        process.env.NEXT_PUBLIC_TOOLBOX_CANDIDATE_URL
      }?id=${getCandidateIdFromCoachOrCandidate(user)}`,
      name: 'Boîte à outils',
      external: true,
      tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_BAO_CLIC,
    },
  ];

  return {
    links: {
      [UserRoles.ADMIN]: [
        {
          href: '/backoffice/admin/membres',
          queryParams: `?${candidateRolesParams}${
            user?.zone ? `zone=${user?.zone}` : ''
          }`,
          name: 'Les membres',
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
            {
              href: '/backoffice/admin/membres',
              queryParams: `?${refererRolesParams}${
                user?.zone ? `zone=${user?.zone}` : ''
              }`,
              name: 'Les prescripteurs',
              // icon: <UserEmptyIcon />,
              tag: GA_TAGS.BACKOFFICE_ADMIN_HEADER_REFERERS_CLIC,
            },
          ],
        },
        {
          href: '/backoffice/admin/structures',
          queryParams: `?${user?.zone ? `zone=${user?.zone}` : ''}`,
          name: 'Les structures partenaires',
          tag: GA_TAGS.BACKOFFICE_ADMIN_HEADER_ORGANIZATIONS_CLIC,
        },
        {
          href: '/backoffice/admin/offres',
          name: 'Les opportunités',
          badge: 'offers',
        },
        {
          href: '/backoffice/annuaire',
          name: "Réseau d'entraide",
        },
      ],
      [UserRoles.CANDIDATE]: candidateHeaderItems,
      [UserRoles.COACH]: [
        {
          href: '/backoffice/dashboard',
          name: 'Mon espace',
          tag: GA_TAGS.BACKOFFICE_COACH_HEADER_DASHBOARD_CLIC,
        },
        {
          href: `/backoffice/candidat/${candidateId}/cv`,
          name: 'CV',
          badge: 'cv',
          disabled: !candidateId,
          tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_CV_CLIC,
        },
        {
          href: '/backoffice/annuaire',
          name: "Réseau d'entraide",
        },
        {
          href: `/backoffice/candidat/${candidateId}/offres/private`,
          name: 'Les offres',
          queryParams: `?status=-1`,
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
          badge: 'note',
          disabled: !candidateId,
          tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_SUIVI_CLIC,
        },
        {
          href: `${
            process.env.NEXT_PUBLIC_TOOLBOX_COACH_URL
          }?id=${getCandidateIdFromCoachOrCandidate(user)}`,
          name: 'Boîte à outils',
          external: true,
          tag: GA_TAGS.BACKOFFICE_COACH_HEADER_BAO_CLIC,
        },
      ],
      [UserRoles.REFERER]: [
        {
          href: '/backoffice/dashboard',
          name: 'Mon espace',
          tag: GA_TAGS.BACKOFFICE_REFERER_HEADER_DASHBOARD_CLIC,
        },
        {
          href: '/backoffice/annuaire',
          name: "Réseau d'entraide",
        },
        {
          href: `${process.env.NEXT_PUBLIC_TOOLBOX_CANDIDATE_URL}${
            candidateId ? `?id=${candidateId}` : ''
          }}`,
          name: 'Boîte à outils',
          external: true,
          tag: GA_TAGS.BACKOFFICE_REFERER_HEADER_BAO_CLIC,
        },
      ],
    },
    messaging: {
      href: '/backoffice/messaging',
      icon: <LucidIcon size={35} name="MessageCircleMore" stroke="thin" />,
      name: 'Messages',
      badge: 'messaging',
    },
    dropdown: [
      {
        href: '/backoffice/parametres',
        icon: <LucidIcon name="Settings2" />,
        name: 'Paramètres',
      },
      {
        href: '',
        onClick: logout,
        icon: <LucidIcon name="LogOut" />,
        name: 'Se déconnecter',
      },
    ],
  };
};
