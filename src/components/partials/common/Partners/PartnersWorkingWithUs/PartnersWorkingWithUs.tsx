import React from 'react';
import { Partners, PartnersListItem } from '../Partners';
import { GA_TAGS } from 'src/constants/tags';

export interface PartnersWorkingWithUsProps {
  tag?: (typeof GA_TAGS)[keyof typeof GA_TAGS];
  displayCta?: boolean;
}

export const PartnersWorkingWithUs = ({
  tag,
  displayCta = true,
}: PartnersWorkingWithUsProps) => {
  const list = [
    {
      name: 'advens',
      logo: '/static/img/partners/advens/logo.png',
      width: 150,
      height: 70,
    },
    {
      name: 'archipel',
      logo: '/static/img/partners/archipel/logo.png',
      width: 200,
      height: 70,
    },
    {
      name: 'ares',
      logo: '/static/img/partners/ares/logo.png',
      width: 150,
      height: 70,
    },
    {
      name: 'randstad',
      logo: '/static/img/partners/randstad/logo.png',
      width: 150,
      height: 70,
    },
    {
      name: 'tbwa',
      logo: '/static/img/partners/tbwa/logo.png',
      width: 150,
      height: 70,
    },
  ] as PartnersListItem[];

  // Ils travaillent avec Entourage Pro
  return (
    <Partners
      title="Ils travaillent avec Entourage Pro"
      list={list}
      tag={tag}
      displayCta={displayCta}
    />
  );
};
