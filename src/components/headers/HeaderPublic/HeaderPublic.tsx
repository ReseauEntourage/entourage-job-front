import React from 'react';
import { GA_TAGS } from 'src/constants/tags';
import { HeaderPublicContent } from './HeaderPublicContent';

const LINKS = [
  {
    href: '/travailler',
    name: 'Devenir candidat(e)',
    tag: GA_TAGS.HEADER_TRAVAILLER_CLIC,
  },
  { href: '/aider', name: 'Devenir coach', tag: GA_TAGS.HEADER_AIDER_CLIC },
  {
    href: '/entreprises',
    name: 'Engager son entreprise',
    tag: GA_TAGS.HEADER_RECRUTER_CLIC,
  },
  {
    href: '/candidats',
    name: 'Découvrir les candidat(e)s',
    tag: GA_TAGS.HEADER_CANDIDATS_CLIC,
  },
];

export const HeaderPublic = () => {
  return <HeaderPublicContent links={LINKS} />;
};
