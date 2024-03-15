import React from 'react';
import {
  IlluCoeurMainsOuvertes,
  IlluCV,
  IlluMalette,
  IlluPoigneeDeMain,
} from 'assets/icons/icons';
import { SimpleIconCTACardsGrid } from 'src/components/partials/utils/SimpleIconCTACardsGrid';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';

export const Engagement = () => {
  return (
    <SimpleIconCTACardsGrid
      title="Et si vous engagiez votre entreprise pour l'inclusion ?"
      subtitle="Si aujourd’hui la RSE est au centre des préoccupations des entreprises, c'est parce qu'elles sont en première ligne pour construire une société qui ne laisse personne en marge. En effet, le travail constitue un levier important de remobilisation et d’intégration."
      cards={[
        {
          icon: <IlluMalette height={225} width={225} />,
          title: 'Engager ses collaborateurs',
          description:
            'Faites vivre des moments inspirants et solidaires à vos équipes',
          onClick: () => {
            gaEvent(GA_TAGS.HOME_ENGAGEMENT_ENTREPRISE_COLLABORATEURS);
          },
          href: process.env.URL_PDF_ENGAGEMENT_ENTREPRISE,
          CTAText: 'Découvrir les formats d’engagement',
        },
        {
          icon: <IlluCV height={225} width={225} />,
          title: 'Découvrir les candidats',
          description: 'Retrouvez tous les profils des candidats Entourage pro',
          onClick: () => {
            gaEvent(GA_TAGS.HOME_ENGAGEMENT_ENTREPRISE_CANDIDATS);
          },
          href: '/candidats',
          CTAText: 'Découvrir les candidats',
        },
        {
          icon: <IlluPoigneeDeMain height={225} width={225} />,
          title: 'Faire du mécénat de compétences',
          description:
            'Engagez ponctuellement vos collaborateurs à nos côtés ou apportez votre aide sur une expertise ciblée',
          onClick: () => {
            gaEvent(GA_TAGS.HOME_ENGAGEMENT_ENTREPRISE_MECENAT_COMPETENCES);
          },
          href: process.env.URL_PDF_MECENAT_COMPETENCES,
          CTAText: 'Découvrir les formats d’engagement',
        },
        {
          icon: <IlluCoeurMainsOuvertes height={225} width={225} />,
          title: 'Proposer du mécénat en nature',
          description:
            'Soutenez-nous via des dons matériels : ordinateurs, mise à disposition de locaux, de dispositifs de communication, etc.',
          onClick: () => {
            gaEvent(GA_TAGS.HOME_ENGAGEMENT_ENTREPRISE_MECENAT_NATURE);
          },
          href: process.env.URL_PDF_MECENAT_NATURE,
          CTAText: 'Découvrir les formats d’engagement',
        },
      ]}
    />
  );
};
