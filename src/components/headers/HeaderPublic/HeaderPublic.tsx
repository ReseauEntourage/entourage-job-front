import React from 'react';
import { GA_TAGS } from 'src/constants/tags';
import { HeaderPublicContent } from './HeaderPublicContent';

const LINKS = [
  {
    href: '/travailler',
    name: 'Devenir candidat',
    tag: GA_TAGS.HEADER_TRAVAILLER_CLIC,
  },
  { href: '/aider', name: 'Devenir coach', tag: GA_TAGS.HEADER_AIDER_CLIC },
  {
    href: '/entreprises',
    name: 'Sensibiliser son entreprise',
    tag: GA_TAGS.HEADER_RECRUTER_CLIC,
  },
  {
    href: '/candidats',
    name: 'Découvrir les candidats',
    tag: GA_TAGS.HEADER_CANDIDATS_CLIC,
  },
  {
    href: '/contact',
    name: 'Nous contacter',
    tag: GA_TAGS.HEADER_CONTACT_CLIC,
  },
  {
    href: '/contact',
    name: 'Nous contacter',
    tag: GA_TAGS.HEADER_CONTACT_CLIC,
  }
];

export const HeaderPublic = () => {
  return <HeaderPublicContent links={LINKS} />;
};
