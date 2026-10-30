import React from 'react';
import { CurrentUserCompany, User } from '@/src/api/types';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { GA_TAGS } from '@/src/constants/tags';
import { UserRoles } from '@/src/constants/users';
import { onboardingExcludedRoles } from '@/src/features/wizard/onboarding/onboarding.constants';
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
        name: 'Accueil',
        tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_DASHBOARD_CLIC,
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
        name: 'Accueil',
        tag: GA_TAGS.BACKOFFICE_COACH_HEADER_DASHBOARD_CLIC,
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

// The admin "Ressources" menu lists the three toolboxes. A toolbox whose URL
// is not configured in the environment is left out rather than rendered as a
// dead link; "Structures de l'inclusion" is always there.
const renderAdminResourcesItem = (): NavConnectedMainItem => {
  const toolboxes = [
    {
      name: 'Boîte à outils coachs',
      href: process.env.NEXT_PUBLIC_TOOLBOX_COACH_URL,
      tag: GA_TAGS.BACKOFFICE_ADMIN_HEADER_BAO_COACH_CLIC,
    },
    {
      name: 'Boîte à outils candidats',
      href: process.env.NEXT_PUBLIC_TOOLBOX_CANDIDATE_URL,
      tag: GA_TAGS.BACKOFFICE_ADMIN_HEADER_BAO_CANDIDAT_CLIC,
    },
    {
      name: 'Boîte à outils entreprises',
      href: process.env.NEXT_PUBLIC_TOOLBOX_COMPANY_URL,
      tag: GA_TAGS.BACKOFFICE_ADMIN_HEADER_BAO_COMPANY_CLIC,
    },
  ];

  return {
    name: 'Ressources',
    tag: GA_TAGS.BACKOFFICE_HEADER_RESSOURCES_CLIC,
    subMenu: [
      ...toolboxes
        .filter((toolbox) => !!toolbox.href)
        .map(({ name, href, tag }) => ({
          href: href as string,
          name,
          external: true,
          tag,
        })),
      {
        href: '/backoffice/ressources/aides-locales',
        name: "Structures de l'inclusion",
        tag: GA_TAGS.BACKOFFICE_HEADER_AIDES_LOCALES_CLIC,
      },
    ],
  };
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
  const canAccessProfile =
    onboardingExcludedRoles.includes(user?.role) ||
    user?.onboardingStatus === 'completed';
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
          href: '/backoffice/dashboard',
          name: 'Accueil',
          tag: GA_TAGS.BACKOFFICE_ADMIN_HEADER_DASHBOARD_CLIC,
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
        renderAdminResourcesItem(),
      ],
      [UserRoles.CANDIDATE]: candidateHeaderItems,
      [UserRoles.COACH]: coachHeaderItems,
      [UserRoles.REFERER]: [
        {
          href: '/backoffice/dashboard',
          name: 'Accueil',
          tag: GA_TAGS.BACKOFFICE_REFERER_HEADER_DASHBOARD_CLIC,
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
              {
                href: '/backoffice/admin/signalements',
                name: 'Les signalements',
                badge: 'reports',
              },
            ],
            // The cog shows the badge too, visible with the menu closed
            badge: 'reports',
          }
        : null,
    messaging: {
      href: '/backoffice/messaging',
      icon: <LucidIcon name="MessageCircleMore" stroke="thin" />,
      name: 'Messages',
      badge: 'messaging',
    },
    dropdown: [
      // "Mon profil" lives in the account menu, not in the tabs. Candidates
      // and coaches who have not completed the onboarding are redirected to
      // it from every backoffice page, the profile included: no entry for them
      ...(canAccessProfile
        ? [
            {
              href: '/backoffice/parametres',
              icon: <LucidIcon name="User" />,
              name: 'Mon profil',
            },
          ]
        : []),
      {
        href: '',
        onClick: logout,
        icon: <LucidIcon name="LogOut" />,
        color: 'darkOrange' as const,
        name: 'Se déconnecter',
      },
    ],
  };
};
