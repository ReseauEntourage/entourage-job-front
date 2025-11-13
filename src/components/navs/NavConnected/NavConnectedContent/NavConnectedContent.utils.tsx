import React from 'react';
import { NavConnectedMainItem } from '../NavConnected.types';
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
  logout: () => void
): {
  links: { [K in UserRoles]: NavConnectedMainItem[] };
  messaging: NavConnectedMainItem;
  dropdown: NavConnectedMainItem[];
} => {
  const isCompanyAdmin = user.company && user.company.companyUser?.isAdmin;

  const candidateHeaderItems: NavConnectedMainItem[] = [
    {
      href: '/backoffice/dashboard',
      name: 'Tableau de bord',
      tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_DASHBOARD_CLIC,
    },
    {
      href: '/backoffice/parametres',
      name: 'Mon profil',
    },
    {
      href: '/backoffice/annuaire',
      name: "Réseau d'entraide",
    },
    {
      href: '/backoffice/events',
      name: 'Evénements',
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

  const coachHeaderItems: NavConnectedMainItem[] = [
    {
      href: '/backoffice/dashboard',
      name: 'Tableau de bord',
      tag: GA_TAGS.BACKOFFICE_COACH_HEADER_DASHBOARD_CLIC,
    },
    {
      href: '/backoffice/parametres',
      name: 'Mon profil',
    },
    ...(isCompanyAdmin
      ? [
          {
            href: '/backoffice/companies/parametres',
            name: 'Mon entreprise',
            tag: GA_TAGS.BACKOFFICE_COACH_HEADER_MY_COMPANY_CLIC,
          },
        ]
      : []),
    {
      href: '/backoffice/annuaire',
      name: "Réseau d'entraide",
    },
    {
      href: '/backoffice/events',
      name: 'Evénements',
    },
    ...(isCompanyAdmin
      ? [
          {
            href: `${
              process.env.NEXT_PUBLIC_TOOLBOX_COMPANY_URL
            }?id=${getCandidateIdFromCoachOrCandidate(user)}`,
            name: 'Boîte à outils',
            external: true,
            tag: GA_TAGS.BACKOFFICE_COMPANY_HEADER_BAO_CLIC,
          },
        ]
      : [
          {
            href: `${
              process.env.NEXT_PUBLIC_TOOLBOX_COACH_URL
            }?id=${getCandidateIdFromCoachOrCandidate(user)}`,
            name: 'Boîte à outils',
            external: true,
            tag: GA_TAGS.BACKOFFICE_COACH_HEADER_BAO_CLIC,
          },
        ]),
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
          href: '/backoffice/annuaire',
          name: "Réseau d'entraide",
        },
      ],
      [UserRoles.CANDIDATE]: candidateHeaderItems,
      [UserRoles.COACH]: coachHeaderItems,
      [UserRoles.REFERER]: [
        {
          href: '/backoffice/dashboard',
          name: 'Tableau de bord',
          tag: GA_TAGS.BACKOFFICE_REFERER_HEADER_DASHBOARD_CLIC,
        },
        {
          href: '/backoffice/parametres',
          name: 'Mon profil',
        },
        {
          href: '/backoffice/annuaire',
          name: "Réseau d'entraide",
        },
        {
          href: '/backoffice/events',
          name: 'Evénements',
        },
        {
          href: `${process.env.NEXT_PUBLIC_TOOLBOX_CANDIDATE_URL}`,
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
        href: '',
        onClick: logout,
        icon: <LucidIcon name="LogOut" />,
        name: 'Se déconnecter',
      },
    ],
  };
};
