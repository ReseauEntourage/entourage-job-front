import { GA_TAGS } from 'src/constants/tags';
import { getCandidateIdFromCoachOrCandidate } from 'src/utils';

export const renderLinks = (user, logout) => {
  return {
    admin: [
      {
        href: '/backoffice/admin/membres',
        queryParams: `?role=Candidat${user?.zone ? `&zone=${user?.zone}` : ''}`,
        name: 'Les membres',
        icon: 'users',
        badge: '',
        tag: GA_TAGS.BACKOFFICE_ADMIN_HEADER_MEMBERS_CLIC,
        subMenu: [
          {
            href: '/backoffice/admin/membres',
            queryParams: `?role=Candidat${
              user?.zone ? `&zone=${user?.zone}` : ''
            }`,
            name: 'Les candidats',
            icon: 'users',
            badge: 'members',
            tag: GA_TAGS.BACKOFFICE_ADMIN_HEADER_CANDIDATS_CLIC,
          },
          {
            href: '/backoffice/admin/membres',
            queryParams: `?role=Coach${
              user?.zone ? `&zone=${user?.zone}` : ''
            }`,
            name: 'Les coachs',
            icon: 'users',
            badge: '',
            tag: GA_TAGS.BACKOFFICE_ADMIN_HEADER_COACHS_CLIC,
          },
        ],
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
        href: '/backoffice/candidat/offres',
        name: 'Mes offres',
        icon: 'list',
        badge: 'offers',
        tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_OFFRES_CLIC,
      },
      {
        href: '/backoffice/candidat/suivi',
        name: 'Mon suivi',
        icon: 'file-text',
        badge: 'note',
        tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_SUIVI_CLIC,
      },
      {
        href: '/backoffice/candidat/cv',
        name: 'Mon CV',
        icon: 'user',
        badge: 'cv',
        tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_CV_CLIC,
      },
    ],
    coach: [
      {
        href: '/backoffice/candidat/offres',
        name: 'Offres',
        icon: 'list',
        badge: 'offers',
        tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_OFFRES_CLIC,
      },
      {
        href: '/backoffice/candidat/suivi',
        name: 'Suivi',
        icon: 'file-text',
        badge: 'note',
        tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_SUIVI_CLIC,
      },
      {
        href: '/backoffice/candidat/cv',
        name: 'CV',
        icon: 'user',
        badge: 'cv',
        tag: GA_TAGS.BACKOFFICE_CANDIDAT_HEADER_CV_CLIC,
      },
      {
        href: `${
          process.env.TOOLBOX_URL
        }?id=${getCandidateIdFromCoachOrCandidate(user)}`,
        name: 'Boîte à outils',
        icon: 'question',
        external: true,
      },
    ],
  };
};
