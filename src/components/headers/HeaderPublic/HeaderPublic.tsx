import React from 'react';
import { GA_TAGS } from 'src/constants/tags';
import { HeaderPublicContent } from './HeaderPublicContent';

const LINKS = [
  {
    href: '/travailler',
    name: 'Je cherche un emploi',
    tag: GA_TAGS.HEADER_TRAVAILLER_CLIC,
  },
  {
    href: '/entreprises',
    name: 'Je recrute',
    tag: GA_TAGS.HEADER_RECRUTER_CLIC,
  },
  { href: '/aider', name: 'Je veux aider', tag: GA_TAGS.HEADER_AIDER_CLIC },
  {
    href: '/orienter',
    name: "J'oriente un candidat",
    tag: GA_TAGS.HEADER_ORIENTER_CLIC,
  },
];

export const HeaderPublic = () => {
  return <HeaderPublicContent links={LINKS} />;
};
