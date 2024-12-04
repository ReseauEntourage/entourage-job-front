import React from 'react';
import { Partners, PartnersListItem } from '../Partners';
import { GA_TAGS } from 'src/constants/tags';

export interface PartnersSupportUsProps {
  tag?: (typeof GA_TAGS)[keyof typeof GA_TAGS];
  displayCta?: boolean;
}

export const PartnersSupportUs = ({
  tag,
  displayCta = true,
}: PartnersSupportUsProps) => {
  const list = [
    {
      name: 'Union Europeene',
      logo: '/static/img/partners/union-europeenne/logo.png',
      width: 180,
      height: 70,
    },
    {
      name: 'Fondation Crédit Mutuel',
      logo: '/static/img/partners/fondation-credit-mutuel/logo.png',
      width: 150,
      height: 70,
    },
    {
      name: 'Région Île de France',
      logo: '/static/img/partners/iledefrance/logo.png',
      width: 150,
      height: 70,
    },
    {
      name: "FDJ Fondation d'Entreprise",
      logo: '/static/img/partners/fdj-fondation-entreprise/logo.png',
      width: 150,
      height: 70,
    },
    {
      name: 'Total Energies Fondation',
      logo: '/static/img/partners/totalenergies-fondation/logo.png',
      width: 150,
      height: 70,
    },
    {
      name: 'Crédit agricole',
      logo: '/static/img/partners/credit-agricole/logo.png',
      width: 150,
      height: 70,
    },
  ] as PartnersListItem[];

  // Ils travaillent avec Entourage Pro
  return (
    <Partners
      title="Ils soutiennent Entourage Pro"
      list={list}
      tag={tag}
      displayCta={displayCta}
    />
  );
};
