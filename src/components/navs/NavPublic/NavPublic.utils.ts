import { GA_TAGS } from '@/src/constants/tags';
import { INavPublicItem } from './NavPublic.types';

export const LINKS: INavPublicItem[] = [
  { href: '/aider', name: 'Devenir coach', tag: GA_TAGS.HEADER_AIDER_CLIC },
  {
    href: '/travailler',
    name: 'Devenir candidat(e)',
    tag: GA_TAGS.HEADER_TRAVAILLER_CLIC,
  },
  {
    href: '/orienter',
    name: 'Orienter un candidat',
    tag: GA_TAGS.HEADER_ORIENTER_CLIC,
  },
  {
    name: 'Engager mon entreprise',
    tag: GA_TAGS.HEADER_RECRUTER_CLIC,
    childrens: [
      {
        href: '/entreprises/recruter-inclusif',
        name: 'Recruter inclusif',
        tag: GA_TAGS.HEADER_RECRUTER_INCLUSIF_CLIC,
      },
      {
        href: '/entreprises/s-engager',
        name: 'Engager mes collaborateurs',
        tag: GA_TAGS.HEADER_ENGAGER_COLLABORATEURS_CLIC,
      },
    ],
  },
];
