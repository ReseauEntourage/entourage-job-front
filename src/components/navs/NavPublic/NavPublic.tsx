import React from 'react';
import { GA_TAGS } from 'src/constants/tags';
import { NavPublicContent } from './NavPublicContent';

const LINKS = [
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
    href: '/entreprises/recruter-inclusif',
    name: 'Engager son entreprise',
    tag: GA_TAGS.HEADER_RECRUTER_CLIC,
  },
];

export const NavPublic = () => {
  return <NavPublicContent links={LINKS} />;
};
