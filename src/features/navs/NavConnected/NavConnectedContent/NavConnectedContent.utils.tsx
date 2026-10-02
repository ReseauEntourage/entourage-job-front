import React from 'react';
import { CurrentUserCompany, User } from '@/src/api/types';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { GA_TAGS } from '@/src/constants/tags';
import { UserRoles } from '@/src/constants/users';
import { NavConnectedMainItem } from '../NavConnected.types';

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

// Placed right after "Réseau d'entraide" for every role, only once a group
// is published. The item stays active on the group and discussion pages since
// the nav matches the current path with `asPath.includes(href)`.
const renderHelpGroupsItems = (
  hasPublishedHelpGroups: boolean
): NavConnectedMainItem[] =>
  hasPublishedHelpGroups
    ? [
        {
          href: '/backoffice/groupes',
          name: 'Groupes',
        },
      ]
    : [];

const renderCandidateHeaderItems = (
  user: User,
  helpGroupsItems: NavConnectedMainItem[]
): NavConnectedMainItem[] => {
  const onboardingStatus = user.onboardingStatus;
  let items: NavConnectedMainItem[] = [];

  if (onboardingStatus === 'completed') {
    items = [
      ...items,
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
      ...helpGroupsItems,
      {
        href: '/backoffice/events',
        name: 'Événements',
      },
      {
        name: 'Ressources',
        tag: GA_TAGS.BACKOFFICE_HEADER_RESSOURCES_CLIC,
        subMenu: [
          {
            href: `${process.env.NEXT_PUBLIC_TOOLBOX_CANDIDATE_URL}`,
            name: 'Boîte à outils',
            external: true,
            tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_BAO_CLIC,
          },
          {
            href: '/backoffice/ressources/aides-locales',
            name: "Structures de l'inclusion",
            tag: GA_TAGS.BACKOFFICE_HEADER_AIDES_LOCALES_CLIC,
          },
          {
            href: '/backoffice/ressources/formations',
            name: 'Formations',
          },
        ],
      },
    ];
  }

  return items;
};

const renderCoachHeaderItems = (
  user: User,
  company: CurrentUserCompany | null,
  helpGroupsItems: NavConnectedMainItem[]
): NavConnectedMainItem[] => {
  const isCompanyAdmin = company && company.companyUser?.isAdmin;
  const onboardingStatus = user.onboardingStatus;

  let items: NavConnectedMainItem[] = [];

  if (onboardingStatus === 'completed') {
    items = [
      ...items,
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
      ...helpGroupsItems,
      {
        href: '/backoffice/events',
        name: 'Événements',
      },
      {
        name: 'Ressources',
        tag: GA_TAGS.BACKOFFICE_HEADER_RESSOURCES_CLIC,
        subMenu: [
          ...(isCompanyAdmin
            ? [
                {
                  href: process.env.NEXT_PUBLIC_TOOLBOX_COMPANY_URL || '',
                  name: 'Boîte à outils',
                  external: true,
                  tag: GA_TAGS.BACKOFFICE_COMPANY_HEADER_BAO_CLIC,
                },
              ]
            : [
                {
                  href: process.env.NEXT_PUBLIC_TOOLBOX_COACH_URL || '',
                  name: 'Boîte à outils',
                  external: true,
                  tag: GA_TAGS.BACKOFFICE_COACH_HEADER_BAO_CLIC,
                },
              ]),
          {
            href: '/backoffice/ressources/aides-locales',
            name: "Structures de l'inclusion",
            tag: GA_TAGS.BACKOFFICE_HEADER_AIDES_LOCALES_CLIC,
          },
          {
            href: '/backoffice/ressources/formations',
            name: 'Formations',
          },
        ],
      },
    ];
  }

  return items;
};

export const renderLinks = (
  user: User,
  logout: () => void,
  company: CurrentUserCompany | null,
  hasPublishedHelpGroups = false
): {
  links: { [K in UserRoles]: NavConnectedMainItem[] };
  administration: NavConnectedMainItem | null;
  messaging: NavConnectedMainItem;
  dropdown: NavConnectedMainItem[];
} => {
  const helpGroupsItems = renderHelpGroupsItems(hasPublishedHelpGroups);
  const candidateHeaderItems = renderCandidateHeaderItems(
    user,
    helpGroupsItems
  );
  const coachHeaderItems = renderCoachHeaderItems(
    user,
    company,
    helpGroupsItems
  );

  return {
    links: {
      [UserRoles.ADMIN]: [
        {
          href: '/backoffice/parametres',
          name: 'Mon profil',
        },
        {
          href: '/backoffice/annuaire',
          name: "Réseau d'entraide",
        },
        ...helpGroupsItems,
        {
          href: '/backoffice/events',
          name: 'Événements',
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
        ...helpGroupsItems,
        {
          href: '/backoffice/events',
          name: 'Événements',
        },
        {
          name: 'Ressources',
          tag: GA_TAGS.BACKOFFICE_HEADER_RESSOURCES_CLIC,
          subMenu: [
            {
              href: `${process.env.NEXT_PUBLIC_TOOLBOX_CANDIDATE_URL}`,
              name: 'Boîte à outils',
              external: true,
              tag: GA_TAGS.BACKOFFICE_REFERER_HEADER_BAO_CLIC,
            },
            {
              href: '/backoffice/ressources/aides-locales',
              name: "Structures de l'inclusion",
              tag: GA_TAGS.BACKOFFICE_HEADER_AIDES_LOCALES_CLIC,
            },
          ],
        },
      ],
    },
    // Admin pages live in their own menu (cog icon) instead of the main nav.
    // The sub menu has a single level, hence the members entries flattened.
    administration:
      user?.role === UserRoles.ADMIN
        ? {
            name: 'Administration',
            icon: <LucidIcon name="Settings" stroke="thin" />,
            subMenu: [
              {
                href: '/backoffice/admin/membres',
                queryParams: `?${candidateRolesParams}${
                  user?.zone ? `zone=${user?.zone}` : ''
                }`,
                name: 'Les candidats',
                tag: GA_TAGS.BACKOFFICE_ADMIN_HEADER_CANDIDATS_CLIC,
              },
              {
                href: '/backoffice/admin/membres',
                queryParams: `?${coachRolesParams}${
                  user?.zone ? `zone=${user?.zone}` : ''
                }`,
                name: 'Les coachs',
                tag: GA_TAGS.BACKOFFICE_ADMIN_HEADER_COACHS_CLIC,
              },
              {
                href: '/backoffice/admin/membres',
                queryParams: `?${refererRolesParams}${
                  user?.zone ? `zone=${user?.zone}` : ''
                }`,
                name: 'Les prescripteurs',
                tag: GA_TAGS.BACKOFFICE_ADMIN_HEADER_REFERERS_CLIC,
              },
              {
                href: '/backoffice/admin/structures',
                queryParams: `?${user?.zone ? `zone=${user?.zone}` : ''}`,
                name: 'Les structures partenaires',
                tag: GA_TAGS.BACKOFFICE_ADMIN_HEADER_ORGANIZATIONS_CLIC,
              },
              {
                href: '/backoffice/admin/groupes',
                name: 'Les groupes',
              },
            ],
          }
        : null,
    messaging: {
      href: '/backoffice/messaging',
      icon: <LucidIcon name="MessageCircleMore" stroke="thin" />,
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
